import { Request, Response } from "express";
import { UserRequestDTO } from "../types";
import { createUserService, getUserService } from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  try {
    //utilizar el DTO para validar el body
    const UserDTO: UserRequestDTO = req.body;
    const newUser = await createUserService(UserDTO);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserService(Number(id));
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};
