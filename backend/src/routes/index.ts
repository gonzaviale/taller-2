import { Router } from "express";
import userRouter from "./userRouter";
import productRouter from "./productRouter";

const router = Router();

// Define las rutas para el userRouter
router.use("/user", userRouter);

// Define las rutas para el productRouter
router.use("/product", productRouter);

export default router;