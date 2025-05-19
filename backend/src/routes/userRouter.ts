import { Router } from "express";
import { 
    createUserController, 
    getAllUsersController, 
    getUserController,
    updateUserController, 
} from "../controllers/userController";

const userRouter = Router();

userRouter.post("", createUserController);

userRouter.get("/:id", getUserController);

userRouter.get("", getAllUsersController);

userRouter.put("/:id", updateUserController);

export default userRouter;