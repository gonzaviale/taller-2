import { Router } from "express";
import userRouter from "./userRouter";
import productRouter from "./productRouter";
import cartRouter from "./purchaseRouter";

const router = Router();

// Define las rutas para el userRouter
router.use("/user", userRouter);

// Define las rutas para el productRouter
router.use("/product", productRouter);

// Define las rutas para el cartRouter
router.use("/cart", cartRouter);

export default router;