import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateMailDto {

    @IsEmail()
    @IsOptional()
    to?: string;
  
    @IsString()
    @IsNotEmpty()
    subject: string;
  
    @IsString()
    @IsNotEmpty()
    html: string;
}
