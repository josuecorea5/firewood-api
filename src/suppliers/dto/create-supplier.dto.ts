import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(8)
  fullName: string;

  @IsString()
  @Transform(({ value }) => value?.replace(/[\s-]/g, ''))
  @MinLength(8)
  telephone: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(8)
  address: string;
}
