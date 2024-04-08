import type { Request, Response } from "express";
import { Product } from "../models/product.model";
import { uploadImagetoCloudinary } from "../utils/cloudinary";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const imagePath = req.file.path;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageResponse = await uploadImagetoCloudinary(imagePath);
    if (!imageResponse) {
      return res.status(500).json({ message: "Failed to upload image" });
    }
    await Product.create({
      name,
      description,
      price,
      category,
      image: imageResponse,
    });
    return res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ message: "Products found", data: products });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
