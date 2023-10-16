import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateSupplierDto {
  @ApiProperty({
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(8)
  fullName: string;

  @ApiProperty({
    minLength: 8,
  })
  @IsString()
  @Transform(({ value }) => value?.replace(/[\s-]/g, ''))
  @MinLength(8)
  telephone: string;

  @ApiProperty({
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MinLength(8)
  address: string;
}
