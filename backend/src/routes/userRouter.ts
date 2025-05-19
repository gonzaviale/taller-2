import { Router } from "express";
import { createUserController, getUserController } from "../controllers/userController";

const userRouter = Router();

userRouter.post("", createUserController);

userRouter.get("/:id", getUserController);

export default userRouter;