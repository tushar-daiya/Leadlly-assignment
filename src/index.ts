import express from "express";
import cors from "cors";
import { userRouter } from "./routers/user.router";
import { connectDB } from "./configs/dbConfig";
import cookieParser from "cookie-parser";
import { productRouter } from "./routers/product.router";
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
connectDB();
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
