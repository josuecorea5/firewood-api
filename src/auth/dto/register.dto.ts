import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    minimum: 5,
  })
  @IsString()
  @MinLength(5)
  fullName: string;

  @ApiProperty({
    example: 'john@gmail.com'
  })
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'La contraseña debe contener al menos una letra mayúscula, minúscula y un número'})
  password: string;
}
