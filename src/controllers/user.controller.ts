import type { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "../types/interfaces";
import jwt, { type Secret } from "jsonwebtoken";

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
    expiresIn: "1d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, mobile } = req.body;
    if (!name || !email || !password || !address || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existingUser: HydratedDocument<IUser> | null = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHashed = bcrypt.hashSync(password, salt);
    const newUser: HydratedDocument<IUser> = await User.create({
      name,
      email,
      password: passwordHashed,
      address,
      mobile,
    });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existingUser: HydratedDocument<IUser> | null = await User.findOne({
      email,
    });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken: string = generateAccessToken(
      existingUser._id.toString()
    );
    res.cookie("accessToken", accessToken, { httpOnly: true });
    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: existingUser,
        accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", { httpOnly: true });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const { name, password, address, mobile } = req.body;
    let existingUser: HydratedDocument<IUser> | null = await User.findOne({
      email: req.user.email,
    });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    if (name) {
      existingUser.name = name;
    }
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHashed = bcrypt.hashSync(password, salt);
      existingUser.password = passwordHashed;
    }
    if (address) {
      existingUser.address = address;
    }
    if (mobile) {
      existingUser.mobile = mobile;
    }
    await existingUser.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
