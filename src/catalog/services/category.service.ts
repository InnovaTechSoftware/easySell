import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infrastructure/config/DbConfig';
import { Category } from '../../domain/entities/CategoryModel';
import { CategoryDto } from '../dto/CategoryDto';
import { SubCategory } from '../../domain/entities/SubcategoryModel';
import { HttpException } from '../../../../shared/infrastructure/http/HttpException';

export class CategoryServices {
  private categoryRepository: Repository<Category>;
  private subCategoryRepository: Repository<SubCategory>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.subCategoryRepository = AppDataSource.getRepository(SubCategory);
  }

  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findOneBy({
        name: categoryDto.name,
      });

      if (existingCategory) {
        throw HttpException.badRequest(
          `Category with name "${categoryDto.name}" already exists`,
        );
      }

      const category = this.categoryRepository.create({
        name: categoryDto.name,
      });

      const savedCategory = await this.categoryRepository.save(category);

      if (categoryDto.subCategories && categoryDto.subCategories.length > 0) {
        const subcategories = categoryDto.subCategories.map((subCatDto) => {
          return this.subCategoryRepository.create({
            name: subCatDto.name,
            category: savedCategory,
            products: subCatDto.products || [],
          });
        });

        await this.subCategoryRepository.save(subcategories);
        savedCategory.subCategories = subcategories;
      }

      const result = await this.categoryRepository.findOne({
        where: { id: savedCategory.id },
        relations: ['subCategories'],
      });

      if (!result) {
        throw HttpException.internalServer('Error retrieving saved category');
      }

      return result;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw HttpException.internalServer(
        `Failed to create category: ${error.message}`,
      );
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categoryId = parseInt(id);
      return await this.categoryRepository.findOneBy({ id: categoryId });
    } catch (error: any) {
      console.error('Error getting category by ID:', error);
      throw new Error(`Failed to get category by ID: ${error.message}`);
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error: any) {
      console.error('Error getting all categories:', error);
      throw new Error(`Failed to get all categories: ${error.message}`);
    }
  }

  async updateCategory(
    id: string,
    categoryDto: CategoryDto,
  ): Promise<Category | null> {
    try {
      await this.categoryRepository.update(id, categoryDto);
      return await this.getCategoryById(id);
    } catch (error: any) {
      console.error('Error updating category:', error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const deleteResult = await this.categoryRepository.delete(id);
      return deleteResult.affected !== 0;
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}
