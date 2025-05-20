import { Request, Response } from "express";
import { ProductDTO } from "../types/DTO";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductService,
  updateProductService,
} from "../services/productService";

export const createProductController = async (req: Request, res: Response) => {
  try {
    //utilizar el DTO para validar el body
    const ProductDTO: ProductDTO = req.body;
    const newProduct = await createProductService(ProductDTO);
    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductService(Number(id));
    res.status(200).json(product);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    // Convertir page y limit a números, si no son válidos, usar valores por defecto
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const products = await getAllProductsService(pageNumber, limitNumber);
    res.status(200).json(products);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productDTO: ProductDTO = req.body;

    // Validar que el id sea un número
    if (isNaN(Number(id))) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const updatedProduct = await updateProductService(Number(id), productDTO);
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProductService(Number(id));
    res.status(200).json(deletedProduct);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};
