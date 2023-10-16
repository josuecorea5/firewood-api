import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSaleDto {
  @IsNotEmpty()
  @IsUUID()
  idProduct: string;
}
