import { Router } from "express";
import { createUserController, getAllUsersController, getUserController } from "../controllers/userController";

const userRouter = Router();

userRouter.post("", createUserController);

userRouter.get("/:id", getUserController);

userRouter.get("", getAllUsersController);

export default userRouter;