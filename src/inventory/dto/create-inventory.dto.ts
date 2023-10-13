import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  unitPrice: number;

  @IsNotEmpty()
  @IsUUID()
  buyingId: string;

  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
