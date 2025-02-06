import { Request, Response } from 'express';
import { SubcategoryServices } from '../../../application/services/SubCategoryServices';
import { SubCategoryDto } from '../../../application/dto/SubCategoryDto';
import { ControllerInterface } from '../../../../../shared/interfaces/ControllerInterface';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class SubcategoryController implements ControllerInterface {
  private service: SubcategoryServices;

  constructor() {
    this.service = new SubcategoryServices();
  }

  public create = async (req: Request, res: Response) => {
    try {
      // Transformar el plain object a una instancia de SubCategoryDto
      const subcategoryDto = plainToInstance(SubCategoryDto, req.body);

      // Validar la instancia
      const errors = await validate(subcategoryDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      const newSubcategory =
        await this.service.createSubcategory(subcategoryDto);
      return res.status(201).json({
        message: 'Created Successfully',
        data: newSubcategory,
      });
    } catch (error: any) {
      console.error('Error creating subcategory:', error);
      return res.status(500).json({
        message: 'Error creating Subcategory',
        error: error.message,
      });
    }
  };

  public getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const subcategory = await this.service.getSubcategoryById(id);
      res.status(200).json(subcategory);
    } catch (error) {
      res.status(500).json({ message: 'Error getting Subcategory', error });
    }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const subcategories = await this.service.getAllSubcategories();
      res.status(200).json(subcategories);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error getting all Subcategories', error });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const subcatDto: SubCategoryDto = req.body;
      const Subcategory = await this.service.updateSubcategory(id, subcatDto);
      res
        .status(200)
        .json({ message: 'Updated Successfully', data: Subcategory });
    } catch (error) {
      res.status(500).json({ message: 'Error updating Subcategory', error });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const isDeleted = await this.service.deleteSubcategory(id);
      const result = isDeleted ? 'Deleted Successfully' : 'Not Found';
      const status = isDeleted ? 200 : 404;
      res.status(status).json({ message: result });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Subcategory', error });
    }
  };
}

// export const createSubcategory = new SubcategoryController().create;

// export const getOneSubcategory = new SubcategoryController().getOne;

// export const getAllSubcategories = new SubcategoryController().getAll;

// export const updateSubcategory = new SubcategoryController().update;

// export const deleteSubcategory = new SubcategoryController().delete;
