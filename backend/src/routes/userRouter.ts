import { Router } from "express";
import { createUserController } from "../controllers/userController";

const userRouter = Router();

userRouter.post("", createUserController);

export default userRouter;