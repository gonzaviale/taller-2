import { Request, Response } from "express";
import { UserDTO } from "../types";
import { createUserService } from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  try {
    //utilizar el DTO para validar el body
    const UserDTO: UserDTO = req.body;
    const newUser = await createUserService(UserDTO);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error creating user", error });
  }
};
