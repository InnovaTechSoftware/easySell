import { Type } from 'class-transformer';
import { SubCategoryDto } from './create-subcategory.dto';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CategoryDto {
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCategoryDto)
  subCategories?: SubCategoryDto[];
}
