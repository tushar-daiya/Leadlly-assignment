import { Schema ,model} from "mongoose";
import type { IUser } from "../types/interfaces";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
  },
  mobile: {
    type: Number,
    required: true,
  },
},{
    timestamps: true,
});

export const User = model<IUser>("User", userSchema);