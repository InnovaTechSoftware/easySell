import { Transform } from "class-transformer";
import { IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto{
    
    @IsString()
    name: string;
    
    @IsString()
    lastname: string;
    
    @IsString()
    documentType: string;
    
    @IsNumber()
    document: number;
 
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    user: string
    
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(8)
    password: string;
    
}