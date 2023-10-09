import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(5)
  fullName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'La contraseña debe contener al menos una letra mayúscula, minúscula y un número'})
  password: string;
}
