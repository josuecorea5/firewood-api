import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateSupplierDto {
  @IsString()
  @Transform(({ value }) => value?.replace(/[\s]/g, ''))
  @MinLength(8)
  fullName: string;

  @IsString()
  @Transform(({ value }) => value?.replace(/[\s-]/g, ''))
  @MinLength(8)
  telephone: string;

  @IsString()
  @Transform(({ value }) => value?.replace(/[\s]/g, ''))
  @MinLength(8)
  address: string;
}
