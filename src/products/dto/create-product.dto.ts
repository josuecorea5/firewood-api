import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @Transform(({ value }) => value.trim())
  description: string;

  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNotEmpty({ each: true })
  @IsArray()
  images: string[];
}
