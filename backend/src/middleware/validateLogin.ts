import { Request, Response, NextFunction } from "express";

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return;
    }

    next();
};
