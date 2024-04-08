import type { Request } from "express";
import type { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
  mobile: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CustomRequest extends Request {
  user: IUser;
}
