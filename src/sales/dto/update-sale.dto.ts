import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateSaleDto {
  @IsNotEmpty()
  @IsUUID()
  idProduct: string;
}
