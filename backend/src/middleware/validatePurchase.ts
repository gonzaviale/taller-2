import { NextFunction, Request, Response } from "express";

export const validatePurchase = (req: Request, res: Response, next: NextFunction) => {
    const { userId, products, status } = req.body;

    // verificar si userId, productIds y status son válidos
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
    }

    if (!userId || !Array.isArray(products) || products.length === 0) {
        res.status(400).json({ message: "Invalid userId or products" });
    }

    const validStatuses = ["buying", "purchased", "cancelled"];
    if (status && !validStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status" });
    }

    next();
};