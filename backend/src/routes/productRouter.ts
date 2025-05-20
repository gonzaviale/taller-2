import { Router } from "express";
import {
  createProductController,
  getProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController";

const productRouter = Router();

productRouter.post("", createProductController);

productRouter.get("/:id", getProductController);

productRouter.get("", getAllProductsController);

productRouter.put("/:id", updateProductController);

productRouter.delete("/:id", deleteProductController);

export default productRouter;
