import { Router } from "express";
import cateRouter from "./categories/categories.js";
import sizeRouter from "./sizes/size.js";
import productRouter from "./products/products.js";
import { paymentRouter } from "./payments/payment.js";
import { colorRouter } from "./colors/color.js";
import userRouter from "./users/user.js";
import variantRouter from "./variants/variant.js";
import itemOrderRouter from "./itemOrder/itemOrder.js";

const router = Router();

router.use(`/api`, cateRouter);
router.use(`/api`, sizeRouter);
router.use(`/api`, productRouter);
router.use(`/api`, paymentRouter);
router.use(`/api`, colorRouter);
router.use(`/api`, userRouter);
router.use(`/api`, variantRouter);
router.use(`/api`, itemOrderRouter);

export default router;
