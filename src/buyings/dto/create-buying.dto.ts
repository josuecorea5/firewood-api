import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateBuyingDto {
  @ApiProperty({
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
  })
  @IsNotEmpty()
  @IsPositive()
  @Transform(({ value }) =>  Number(value))
  price: number;

  @ApiProperty({
    description: 'The id of the supplier (uuid)',
  })
  @IsUUID()
  @IsNotEmpty()
  supplierId: string;
}
