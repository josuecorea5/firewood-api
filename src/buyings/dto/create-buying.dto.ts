import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateBuyingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) =>  Number(value))
  price: number;

  @IsUUID()
  @IsNotEmpty()
  supplierId: string;
}
