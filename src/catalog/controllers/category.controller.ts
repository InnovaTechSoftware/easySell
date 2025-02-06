import { Request, Response } from 'express';
import { CategoryServices } from '../../../application/services/CategoryServices';
import { CategoryDto } from '../../../application/dto/CategoryDto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BaseController } from './BaseController';
import { HttpException } from '../../../../../shared/infrastructure/http/HttpException';
import { ControllerInterface } from '../../../../../shared/interfaces/ControllerInterface';

class CategoryController extends BaseController implements ControllerInterface {
  private categoryServices: CategoryServices;

  constructor() {
    super();
    this.categoryServices = new CategoryServices();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const categoryDto = plainToInstance(CategoryDto, req.body);
      const errors = await validate(categoryDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        throw errors; // Lanza los errores para que sean manejados por el middleware
      }

      const newCategory =
        await this.categoryServices.createCategory(categoryDto);
      return this.sendResponse(res, newCategory, 201, 'Created Successfully');
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  public getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryServices.getCategoryById(id);

      if (!category) {
        throw HttpException.notFound('Category not found');
      }

      return this.sendResponse(
        res,
        category,
        200,
        'Category retrieved successfully',
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryServices.getAllCategories();
      return this.sendResponse(
        res,
        categories,
        200,
        'Categories retrieved successfully',
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const categoryDto = plainToInstance(CategoryDto, req.body);
      const errors = await validate(categoryDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        throw errors; // Lanza los errores para que sean manejados por el middleware
      }

      const updatedCategory = await this.categoryServices.updateCategory(
        id,
        categoryDto,
      );

      if (!updatedCategory) {
        throw HttpException.notFound('Category not found');
      }

      return this.sendResponse(
        res,
        updatedCategory,
        200,
        'Updated Successfully',
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.categoryServices.deleteCategory(id);

      if (!result) {
        throw HttpException.notFound('Category not found');
      }

      return this.sendResponse(res, null, 200, 'Category deleted successfully');
    } catch (error) {
      return this.sendError(res, error);
    }
  };
}

export const createCategory = new CategoryController().create;
export const getOneCategory = new CategoryController().getOne;
export const getAllCategories = new CategoryController().getAll;
export const updateCategory = new CategoryController().update;
export const deleteCategory = new CategoryController().delete;
