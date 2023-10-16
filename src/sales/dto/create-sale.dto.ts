import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { SaleStatus } from "../enums/sales-status.enum";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSaleDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsOptional()
  @IsEnum(SaleStatus, { message: 'Status only accept COMPLETED or CANCELLED value'})
  status?: SaleStatus;

  @ApiProperty({
    description: 'Product ID (uuid)',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
