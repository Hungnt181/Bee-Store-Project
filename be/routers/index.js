import { Router } from "express";
import cateRouter from "./categories/categories.js";
import sizeRouter from "./sizes/size.js";
import productRouter from "./products/products.js";
import { paymentRouter } from "./payments/payment.js";
import { colorRouter } from "./colors/color.js";
import userRouter from "./users/user.js";
import variantRouter from "./variants/variant.js";
import voucherApiRouter from "./vouchers/voucherApi.js";
import orderApiRouter from "./orders/orderApi.js";
import itemOrderRouter from "./itemOrder/itemOrder.js";
import { commentRouter } from "./comments/comment.js";
import { receiverRouter } from "./receiverInfor/receiverInfor.js";
import { bannerRouter } from "./banners/bannerRouters.js";

const router = Router();

router.use(`/api`, cateRouter);
router.use(`/api`, sizeRouter);
router.use(`/api`, productRouter);
router.use(`/api`, paymentRouter);
router.use(`/api`, colorRouter);
router.use(`/api`, userRouter);
router.use(`/api`, variantRouter);
router.use(`/api`, voucherApiRouter);
router.use(`/api`, orderApiRouter);
router.use(`/api`, itemOrderRouter);
router.use(`/api`, commentRouter);
router.use(`/api`, receiverRouter);
router.use(`/api`, bannerRouter);

export default router;
