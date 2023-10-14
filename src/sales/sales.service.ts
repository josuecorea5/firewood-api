import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { InventoryService } from 'src/inventory/inventory.service';

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
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    const product = await this.productRepository.findOneBy({ id: productId, isAvailable: true});

    if(!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      const stockInventory = await this.inventoryService.findStockByProductId(productId);

      if(!stockInventory) {
        throw new BadRequestException('Product not available in stock');
      }

      if(stockInventory.stock < saleDto.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const sale = this.saleRepository.create({
        ...saleDto,
        product: product,
        user: user
      })

      const inventoryUpdated =  await this.inventoryService.update(stockInventory.id, {
        stock: stockInventory.stock - saleDto.quantity,
      }, user)

      if(inventoryUpdated.stock === 0) {
        await this.inventoryService.changeStateInventory(stockInventory.id, false);
      }

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

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
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
