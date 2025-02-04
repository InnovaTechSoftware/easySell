import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  documentType: string;

  @IsNumber()
  document: number;

  @IsString()
  phone: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  user: string;

  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  password: string;
}
