import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";
import { createProduct, getAllProducts } from "../controllers/product.controller";
export const productRouter = Router();

productRouter.post("/create",verifyToken,upload.single("image"),createProduct)
productRouter.get("/all",verifyToken,getAllProducts)
