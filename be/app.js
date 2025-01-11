import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routers/products/products";
import { colorRouter } from "./routers/colors/color";
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routers
app.use(`/api`, productRouter);
app.use(`/api`, colorRouter);
// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DATN");

export const viteNodeApp = app;
