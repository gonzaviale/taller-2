import { Request, Response } from "express";
import { createPurchaseService, getPurchaseService, getAllPurchasesService, updatePurchaseService, deletePurchaseService } from "../services/purchaseService";
import { verifyToken } from "../utils/verifyToken";
import { User } from "../models/User";

export const createPurchaseController = async (req: Request, res: Response) => {
  try {
    const { userId, products } = req.body;

    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);
    const { username } = verifyToken(token!);

    const user = await User.findOne({ where: { username } });
    if (!user) res.status(404).json({ message: 'Usuario no encontrado' });

    const newPurchase = await createPurchaseService(userId, products);
    res.status(201).json(newPurchase);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const getPurchaseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await getPurchaseService(Number(id));
    res.status(200).json(purchase);
  } catch (error: any) {
    res.status(404).json({ message: error.message || error });
  }
};

export const getAllPurchasesController = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const statusString = typeof status === "string" ? status : null;

    const purchases = await getAllPurchasesService(pageNumber, limitNumber, statusString);
    res.status(200).json(purchases);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const updatePurchaseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Invalid status" });
    }

    const updatedPurchase = await updatePurchaseService(Number(id), status);
    res.status(200).json(updatedPurchase);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || error });
  }
};

export const deletePurchaseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePurchaseService(Number(id));
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    res.status(404).json({ message: error.message || error });
  }
};