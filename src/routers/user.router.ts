import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller";

import { verifyToken } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout",verifyToken, logoutUser);
userRouter.patch("/update",verifyToken, updateUser);
