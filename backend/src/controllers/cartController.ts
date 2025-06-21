import { Request, Response } from "express";
import { createCartService, getCartService, getAllCartsService, updateCartService, deleteCartService } from "../services/cartService";

export const createCartController = async (req: Request, res: Response) => {
  try {
    const { userId, productIds } = req.body;

    const newCart = await createCartService(userId, productIds);
    res.status(201).json(newCart);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const getCartController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cart = await getCartService(Number(id));
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(404).json({ message: error.message || error });
  }
};

export const getAllCartsController = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const statusString = typeof status === "string" ? status : null;

    const carts = await getAllCartsService(pageNumber, limitNumber, statusString);
    res.status(200).json(carts);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const updateCartController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Invalid status" });
    }

    const updatedCart = await updateCartService(Number(id), status);
    res.status(200).json(updatedCart);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const deleteCartController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCartService(Number(id));
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message || error });
  }
};