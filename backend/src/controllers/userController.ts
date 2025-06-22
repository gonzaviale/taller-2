import { Request, Response } from "express";
import { UserRequestDTO } from "../types/DTO";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserService,
  updateUserService,
  loginService,
} from "../services/userService";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar que el email y la contraseña estén presentes
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
    }

    const user = await loginService(email, password);

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

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
    res.status(404).json({
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
    await deleteUserService(Number(id));
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res.status(404).json({
      message: error.message || error,
    });
  }
};
