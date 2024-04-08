import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import type { CustomRequest, IUser } from "../types/interfaces";
import { User } from "../models/user.model";
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const decoded: jwt.JwtPayload | string = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as Secret
    );
    if (typeof decoded === "string") {
      throw new Error("Invalid token");
    }
    const user: IUser | null = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    (req as CustomRequest).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "User not authenticated" });
  }
};
