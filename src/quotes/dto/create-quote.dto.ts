import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  product: string;
}
