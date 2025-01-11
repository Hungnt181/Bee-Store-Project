import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routers/products/products";
import { colorRouter } from "./routers/colors/color";
import userRouter from "./routers/users/user.js";
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// routers
app.use(`/api`, productRouter);
app.use(`/api`, colorRouter);
app.use(`/api`, userRouter);
// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DATN");

export const viteNodeApp = app;
