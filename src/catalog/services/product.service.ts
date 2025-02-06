import { Repository } from 'typeorm';
import { Product } from '../model/products/entities/ProductModel';
import { ProductDto } from '../dto/ProductDto';
import { AppDataSource } from '../../../../shared/infrastructure/config/DbConfig';
import { validate } from 'class-validator';
import { SubCategory } from '../model/products/entities/SubcategoryModel';
import { Category } from '../model/products/entities/CategoryModel';

export class ProductServices {
  productRepository: Repository<Product>;
  subcategoryRepository: Repository<SubCategory>;
  categoryRepository: Repository<Category>;

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.subcategoryRepository = AppDataSource.getRepository(SubCategory);
  }

  public async createProduct(productDto: ProductDto): Promise<Product> {
    try {
      const errors = await validate(productDto);

      if (errors.length > 0) {
        throw new Error(
          `Validation failed: ${errors
            .map((error) => error.toString())
            .join(', ')}`,
        );
      }

      const subCategory = await this.subcategoryRepository.findOne({
        where: { id: productDto.subCategory.id },
      });

      const newProduct = this.productRepository.create({
        ...productDto,
        subCategory: subCategory?.id ? subCategory : undefined,
      });

      await this.productRepository.save(newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating Product:', error);
      throw error;
    }
  }

  // public async getProductById(id: string): Promise<Product | null> {
  //   try {
  //     const productId = parseInt(id);
  //     return await this.productRepository.findOne({
  //       where: { id: productId },
  //       relations: ["subCategory"],
  //     });
  //   } catch (error) {
  //     console.error("Error getting Product by ID:", error);
  //     throw error;
  //   }
  // }

  public async getAllProducts(): Promise<object[]> {
    try {
      const productData: Array<object> = [];
      const products = await this.productRepository.find({
        relations: ['subCategory', 'subCategory.category'],
      });

      products.forEach((product) => {
        productData.push(product.toJSON());
      });

      return productData;
    } catch (error) {
      console.error('Error getting all Products:', error);
      throw error;
    }
  }

  // public async updateProduct(
  //   id: string,
  //   productDto: ProductDto
  // ): Promise<Product | null> {
  //   try {
  //     await this.productRepository.update(id, productDto);
  //     return await this.getProductById(id);
  //   } catch (error) {
  //     console.error("Error updating Product:", error);
  //     throw error;
  //   }
  // }

  // public async deleteProduct(id: string): Promise<boolean> {
  //   try {
  //     const deleteResult = await this.productRepository.delete(id);
  //     return deleteResult.affected !== 0;
  //   } catch (error) {
  //     console.error("Error deleting Product:", error);
  //     throw error;
  //   }
  // }
}
