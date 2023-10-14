import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { SaleStatus } from "../enums/sales-status.enum";
import { Transform } from "class-transformer";

export class CreateSaleDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsOptional()
  @IsEnum(SaleStatus, { message: 'Status only accept COMPLETED or CANCELLED value'})
  status?: SaleStatus;

  @IsNotEmpty()
  @IsUUID()
  productId: string;
}