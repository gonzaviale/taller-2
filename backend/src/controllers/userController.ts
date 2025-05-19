import { Request, Response } from "express";
import { UserRequestDTO } from "../types";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserService,
  updateUserService,
} from "../services/userService";

export const createUserController = async (req: Request, res: Response) => {
  try {
    //utilizar el DTO para validar el body
    const UserDTO: UserRequestDTO = req.body;
    const newUser = await createUserService(UserDTO);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserService(Number(id));
    res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    // Convertir page y limit a números, si no son válidos, usar valores por defecto
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const users = await getAllUsersService(pageNumber, limitNumber);
    res.status(200).json(users);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userDTO: UserRequestDTO = req.body;

    // Validar que el id sea un número
    if (isNaN(Number(id))) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const updatedUser = await updateUserService(Number(id), userDTO);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserService(Number(id));
    res.status(200).json(deletedUser);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      message: error.message || error,
    });
  }
};
