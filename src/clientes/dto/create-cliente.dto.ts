import { IsInt, IsString } from "class-validator";

export class CreateClienteDto {

    @IsString()
    name: string

    @IsString()
    lastname: string;

    @IsString()
    documentType: string;

    @IsInt()
    document: number;


}
