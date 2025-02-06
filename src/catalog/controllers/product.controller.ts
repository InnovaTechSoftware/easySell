import { Request, Response } from 'express';
import { ProductServices } from '../../../application/services/ProductServices';
import { ProductDto } from '../../../application/dto/ProductDto';
import { ControllerInterface } from '../../../../../shared/interfaces/ControllerInterface';
import { validate } from 'class-validator';

export class ProductController implements ControllerInterface {
  private productServices: ProductServices;

  constructor() {
    this.productServices = new ProductServices();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const productDto: ProductDto = req.body;
      validate(productDto).then((errors) => {
        if (errors.length > 0) {
          console.log('validation failed. errors: ', errors);
        }
      });
      // console.log("Creating product:", productDto);
      const newProduct = await this.productServices.createProduct(productDto);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating Product:', error);
      res.status(500).json({ message: 'Error creating Product', error });
    }
  };

  public getOne = async (req: Request, res: Response) => {
    // try {
    //   const { id } = req.params;
    //   const product = await this.productServices.getProductById(id);
    //   if (product) {
    //     res.status(200).json(product);
    //   } else {
    //     res.status(404).json({ message: "Product not found" });
    //   }
    // } catch (error) {
    //   res.status(500).json({ message: "Error retrieving Product", error });
    // }
  };

  public getAll = async (req: Request, res: Response) => {
    try {
      const products = await this.productServices.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving Products', error });
    }
  };

  public update = async (req: Request, res: Response) => {
    // try {
    //   const { id } = req.params;
    //   const productDto: ProductDto = req.body;
    //   const updatedProduct = await this.productServices.updateProduct(
    //     id,
    //     productDto
    //   );
    //   if (updatedProduct) {
    //     res.status(200).json(updatedProduct);
    //   } else {
    //     res.status(404).json({ message: "Product not found" });
    //   }
    // } catch (error) {
    //   res.status(500).json({ message: "Error updating Product", error });
    // }
  };

  public delete = async (req: Request, res: Response) => {
    //   try {
    //     const { id } = req.params;
    //     const deleted = await this.productServices.deleteProduct(id);
    //     if (deleted) {
    //       res.status(200).json({ message: "Product deleted successfully" });
    //     } else {
    //       res.status(404).json({ message: "Product not found" });
    //     }
    //   } catch (error) {
    //     res.status(500).json({ message: "Error deleting Product", error });
    //   }
  };
}
