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
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { sequelize } from '../config/db';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginService(email, password);
    res.status(200).json(user);

  } catch (error: any) {
    console.error("Login error:", error.message);

    if (error.message === "User not found" || error.message === "Invalid password") {
      res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
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

export const loginWithGoogleController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('Email no disponible');

    let user = await sequelize.models.User.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      user = await sequelize.models.User.create({
        email: payload.email,
        username: payload.email.split('@')[0],
        password: 'google_auth',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const userRaw = user.get({ plain: true });

    const token = jwt.sign(
      { username: userRaw.username },
      process.env.JWT_SECRET || 'default',
      { expiresIn: '24h' }
    );

    res.status(200).json({ userId: userRaw.id, token });

  } catch (error: any) {
    console.error('Login con Google Error:', error);
    res.status(401).json({ message: 'Token inválido o error de autenticación' });
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
