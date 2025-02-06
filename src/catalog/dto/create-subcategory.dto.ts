import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsInt,
  ValidateNested,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDto } from './create-product.dto';

export class SubCategoryDto {
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsOptional()
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products?: ProductDto[] = [];
}
