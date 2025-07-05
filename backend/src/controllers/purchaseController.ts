import { Request, Response, NextFunction  } from "express";
import { createPurchaseService, getPurchaseService, getAllPurchasesService, updatePurchaseService, deletePurchaseService ,getAllPurchasesByUserIdService} from "../services/purchaseService";
import { verifyToken } from "../utils/verifyToken";
import { User } from "../models/User";
import { Purchase } from "../models/Purchase";
import { Product } from "../models/Product";
import { RequestHandler } from "express";






export const createPurchaseController = async (req: Request, res: Response) => {
  try {
    const { userId, products } = req.body;

    const authHeader = req.headers['authorization'];
   
    const token = authHeader && authHeader.split(' ')[1];
  
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



export const getPurchasesByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token no proporcionado" });
      return;
    }

    const token = authHeader.split(" ")[1];

    let payload: any;
    try {
      payload = verifyToken(token);
    } catch {
      res.status(401).json({ message: "Token inválido" });
      return;
    }

    const userId = payload.id;
    if (!userId) {
      res.status(401).json({ message: "Token inválido, sin userId" });
      return;
    }

    // Parámetros de paginación fijos (podés tomar de req.query si querés)
    const page = 1;
    const limit = 10;
    const status = null;

    const purchases = await getAllPurchasesByUserIdService(userId, page, limit, status);

    res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    next(error);
  }
};

    




