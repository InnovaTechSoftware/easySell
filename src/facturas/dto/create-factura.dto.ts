import { IsString, IsNumber, IsPositive } from "class-validator";


export class CreateFacturaDto {

    @IsString()
   name: string;
   
    @IsNumber()
    @IsPositive()
   sale: number;

   @IsString()
   type: string;

   @IsString()
   client: string

}
