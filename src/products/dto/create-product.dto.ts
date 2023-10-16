import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  title: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @Transform(({ value }) => value.trim())
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
      format: 'binary'
    }
  })
  @IsOptional()
  images: Express.Multer.File[];
}
