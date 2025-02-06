import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infrastructure/config/DbConfig';
import { SubCategory } from '../model/products/entities/SubcategoryModel';
import { SubCategoryDto } from '../dto/SubCategoryDto';
import { Category } from '../model/products/entities/CategoryModel';

export class SubcategoryServices {
  private subCategoryRepository: Repository<SubCategory>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.subCategoryRepository = AppDataSource.getRepository(SubCategory);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async createSubcategory(
    subcategoryDto: SubCategoryDto,
  ): Promise<SubCategory | null> {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: subcategoryDto.categoryId,
      });

      if (!category) {
        throw new Error(
          `Category with id ${subcategoryDto.categoryId} not found`,
        );
      }

      // Verificar si ya existe una subcategoría con el mismo nombre
      const existingSubcategory = await this.subCategoryRepository.findOne({
        where: {
          name: subcategoryDto.name,
          category: { id: subcategoryDto.categoryId },
        },
      });

      if (existingSubcategory) {
        throw new Error(
          `Subcategory with name "${subcategoryDto.name}" already exists in this category`,
        );
      }

      const subcategory = this.subCategoryRepository.create({
        name: subcategoryDto.name,
        category,
        products: subcategoryDto.products,
      });

      return await this.subCategoryRepository.save(subcategory);
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to create subcategory: ${error.message}`);
    }
  }

  async getSubcategoryById(id: string): Promise<SubCategory | null> {
    try {
      const subcategoryId = parseInt(id);

      return await this.subCategoryRepository.findOneBy({ id: subcategoryId });
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to get category by ID: ${error.message}`);
    }
  }

  async getAllSubcategories(): Promise<SubCategory[]> {
    try {
      return await this.subCategoryRepository.find();
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  async updateSubcategory(
    id: string,
    subcategoryDto: SubCategoryDto,
  ): Promise<SubCategory | null> {
    try {
      await this.subCategoryRepository.update(id, subcategoryDto);
      return await this.getSubcategoryById(id);
    } catch (error: any) {
      console.error(error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    try {
      const deleteResult = await this.subCategoryRepository.delete(id);
      return deleteResult.affected !== 0;
    } catch (error) {
      console.error(error);
    }
    return false;
  }
}
