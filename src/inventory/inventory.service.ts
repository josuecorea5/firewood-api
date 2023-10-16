import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { Buying } from 'src/buyings/entities/buying.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Buying)
    private readonly buyingRepository: Repository<Buying>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(createInventoryDto: CreateInventoryDto, user: User) {

    const { buyingId, productId, ...inventoryDto } = createInventoryDto;

    const buying = await this.buyingRepository.findOneBy({ id: buyingId} );

    const product = await this.productRepository.findOneBy({ id: productId });

    if(!buying) {
      throw new NotFoundException('Buying not found');
    }

    if(!product || !product.isAvailable) {
      throw new BadRequestException('Product not found');
    }

    const inventory = this.inventoryRepository.create({
      ...inventoryDto,
      buying,
      product,
      user
    })

    await this.inventoryRepository.save(inventory);

    delete inventory.user;

    return {
      ...inventory,
      product: {
        ...product,
        images: product.images.map(image => image.url)
      }
    }

  }

  findAll() {
    return this.inventoryRepository.find({where: {isActive: true}});
  }

  async findOne(id: string) {
    const inventory = await this.inventoryRepository.findOneBy({ id, isActive: true });

    if(!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async findStockByProductId(productId: string) {
    const inventory = await this.inventoryRepository.find({
      order: { createdAt: 'DESC'},
      where: {
        product: { id: productId },
        isActive: true,
      }
    })

    if(!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async changeStateInventory(id: string, isActive: boolean) {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if(!inventory) {
      throw new NotFoundException('Inventory not found');
    }
    await this.inventoryRepository.update(id, { isActive })
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto, user: User) {

    const { buyingId, productId, ...inventoryDto } = updateInventoryDto;

    const inventory = await this.inventoryRepository.preload({
      id,
      ...inventoryDto,
      user
    })

    if(!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const buying = await this.buyingRepository.findOneBy({ id: buyingId} );
    const product = await this.productRepository.findOneBy({ id: productId });

    if(!buying) {
      throw new NotFoundException('Buying not found');
    }

    if(!product || !product.isAvailable) {
      throw new BadRequestException('Product not found');
    }

    inventory.buying = buying;
    inventory.product = product;

    await this.inventoryRepository.save(inventory);

    delete inventory.user;

    return inventory;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.inventoryRepository.update(id, { isActive: false})
    return true;
  }
}
