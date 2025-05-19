import { Router } from "express";
import { 
    createUserController, 
    deleteUserController, 
    getAllUsersController, 
    getUserController,
    updateUserController, 
} from "../controllers/userController";

const userRouter = Router();

userRouter.post("", createUserController);

userRouter.get("/:id", getUserController);

userRouter.get("", getAllUsersController);

userRouter.put("/:id", updateUserController);

userRouter.delete("/:id", deleteUserController);

export default userRouter;