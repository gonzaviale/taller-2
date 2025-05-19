import { Router } from "express";
import userRouter from "./userRouter";

const router = Router();

// Define las rutas para el userRouter
router.use("/user", userRouter);

export default router;