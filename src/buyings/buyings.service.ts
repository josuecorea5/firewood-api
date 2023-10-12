import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBuyingDto } from './dto/create-buying.dto';
import { UpdateBuyingDto } from './dto/update-buying.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Buying } from './entities/buying.entity';
import { Repository } from 'typeorm';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

@Injectable()
export class BuyingsService {

  constructor(
    @InjectRepository(Buying)
    private readonly buyingRepository: Repository<Buying>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>
  ) {}

  async create(createBuyingDto: CreateBuyingDto, user: User) {
      const { supplierId, ...suplierDto } = createBuyingDto;

      const supplier = await this.supplierRepository.findOneBy({ id: supplierId})

      if(!supplier) {
        throw new BadRequestException('Supplier not found');
      }

      const buying = this.buyingRepository.create({
        ...suplierDto,
        supplier,
        user
      })

      await this.buyingRepository.save(buying);

      delete buying.user;

      return buying;
  }

  findAll() {
    return this.buyingRepository.find();
  }

  async findOne(id: string) {
    const buying = await this.buyingRepository.findOneBy({ id });

    if(!buying) {
      throw new BadRequestException('Buying not found');
    }

    return buying;
  }

  async update(id: string, updateBuyingDto: UpdateBuyingDto, user: User) {
    const { supplierId, ...buyingDto } = updateBuyingDto;
    const buying = await this.buyingRepository.preload({
      id,
      ...buyingDto,
      user
    });

    if(!buying) {
      throw new BadRequestException('Buying not found');
    }

    const supplier = await this.supplierRepository.findOneBy({ id: supplierId})

    if(!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    buying.supplier = supplier;

    await this.buyingRepository.save(buying);

    return this.findOne(id);
  }
}
