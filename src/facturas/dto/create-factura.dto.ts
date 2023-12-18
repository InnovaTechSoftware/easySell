import { IsString, IsNumber, IsPositive, IsInt, IsOptional, isInt } from "class-validator";


export class CreateFacturaDto {

    @IsString()
   name: string;
   
    @IsNumber()
    @IsPositive()
   sale: number;

   @IsString()
   type: string;

   @IsNumber()
   @IsOptional()
   client?: number;

}
