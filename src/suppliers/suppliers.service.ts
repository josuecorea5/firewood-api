import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class SuppliersService {

  private readonly logger = new Logger();

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>
  ) {}

  async create(createSupplierDto: CreateSupplierDto, user: User) {
    try {
      const supplier = this.supplierRepository.create({
        ...createSupplierDto,
        user
      });
      await this.supplierRepository.save(supplier);
      delete supplier.user;
      return supplier;
      
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit=10, offset = 0 } = paginationDto;

    try {
      const suppliers = await this.supplierRepository.find({
        take: limit,
        skip: offset
      });

      return suppliers;
      
    } catch (error) {
      throw new InternalServerErrorException('Error processing request');
    }

  }

  async findOne(term: string) {
    
    let supplier: Supplier;

    if(isUUID(term)) {
      supplier = await this.supplierRepository.findOneBy( {id: term } );
    }else {
      const queryBuilder = this.supplierRepository.createQueryBuilder('supplier');
      supplier = await queryBuilder
        .where('lower(supplier.fullName) =:fullName', { fullName: term.toLowerCase() }).getOne();
    }

    if(!supplier) {
      throw new BadRequestException('Supplier not found');
    }

    return supplier;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }

  private handleDbException(error: any) {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
  }
}
