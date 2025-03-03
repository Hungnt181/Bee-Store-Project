import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import router from "./routers/index.js";
import "./controllers/orders/CornOrder.js";

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
app.use("", router);
// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DATN");

export const viteNodeApp = app;
