import express from "express";
import mongoose from "mongoose";
<<<<<<< Updated upstream
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routers/products/products";
import { paymentRouter } from "./routers/payments/payment";
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
app.use(`/api`, paymentRouter);
app.use(`/api`, colorRouter);
app.use(`/api`, userRouter);
// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/DATN");
=======
import router from "./routers/index.js";

const app = express();
const port = 3000;

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/do_an_tot_nghiep')
    .then(result => {
        app.use("", router)
        app.listen(port, () => {
            console.log(`Server is running in port ${port}`);
        })
    })
>>>>>>> Stashed changes

export const viteNodeApp = app;
