import { BadRequestException, Injectable } from '@nestjs/common';
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
      throw new BadRequestException('Buying not found');
    }

    if(!product) {
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
    return `This action returns all inventory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
