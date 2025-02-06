import { SubCategoryDto } from './create-subcategory.dto';

export class ProductDto {
  id: number;
  name: string;
  price: number;
  subCategory: SubCategoryDto;
  description: string;
  imgname: string;
  uses: string;
  um: string;
  presentation: string;
  technicalSheet: string;
}
