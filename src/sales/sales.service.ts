import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { SaleStatus } from './enums/sales-status.enum';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Injectable()
export class SalesService {

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly inventoryService: InventoryService,
    private readonly dataSource: DataSource
  ) {}

  async create(createSaleDto: CreateSaleDto, user: User) {
    const { productId, ...saleDto } = createSaleDto;
    const queryRunner = this.dataSource.createQueryRunner();
    
    
    const product = await this.productRepository.findOneBy({ id: productId, isAvailable: true});
    
    if(!product) {
      throw new NotFoundException('Product not found');
    }
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stocksInventory = await this.inventoryService.findStockByProductId(productId);
      let quantity = createSaleDto.quantity;

      if(stocksInventory.length === 0) {
        throw new BadRequestException('Product not available in stock');
      }

      for(const inventory of stocksInventory) {
        if(quantity <= 0) {
          break;
        }
        const deductableQuantity = Math.min(quantity, inventory.stock);

        await queryRunner.manager.update(Inventory, inventory.id, { stock: inventory.stock - deductableQuantity})

        if((inventory.stock - deductableQuantity) === 0) {
          await queryRunner.manager.update(Inventory, inventory.id, { isActive: false })
        }

        quantity -= deductableQuantity;
      }

      if(quantity > 0) {
        throw new BadRequestException('Product not available in stock');
      }

      const sale = this.saleRepository.create({
        ...saleDto,
        product: product,
        user: user
      })

      sale.total = Number((sale.quantity * product.price).toFixed(2));

      await queryRunner.manager.save(sale);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      delete sale.user;
      return sale;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleError(error);
    }
  }

  findAll() {
    return this.saleRepository.find();
  }

  async findOne(id: string) {
    const sale = await this.saleRepository.findOneBy({ id });
    if(!sale) {
      throw new NotFoundException('Sale not found');
    }
    return sale;
  }

  async update(id: string, user: User) {

    const sale = await this.saleRepository.findOneBy({ id });

    if(!sale) {
      throw new NotFoundException('Sale not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {      

      const inventoryByProduct = await this.inventoryService.findStockByProductId(sale.product.id);

      if(!inventoryByProduct || !inventoryByProduct[0]?.isActive) {
        throw new BadRequestException('Product not available in stock');
      }

      await this.inventoryService.update(inventoryByProduct[0]?.id, {
        stock: inventoryByProduct[0]?.stock + sale.quantity,
      }, user);

      await this.saleRepository.update(id, { status: SaleStatus.CANCELLED })
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Sale cancelled successfully' };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }

  private handleError(error: any) {
    switch (error.status) {
      case 404:
        throw new NotFoundException(error.message);
      case 400:
        throw new BadRequestException(error.message);
      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
