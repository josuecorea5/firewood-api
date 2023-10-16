import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreateInventoryDto {
  @ApiProperty({
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  unitPrice: number;

  @ApiProperty({
    description: 'The id of the buying (uuid)',
  })
  @IsNotEmpty()
  @IsUUID()
  buyingId: string;

  @ApiProperty({
    description: 'The id of the product (uuid)',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
