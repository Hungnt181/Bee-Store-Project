import { Router } from "express";
import OrderController from "../../controllers/orders/OrderController.js";

const orderController = new OrderController();
const orderApiRouter = Router();

orderApiRouter.get("/orders", orderController.getOrders);
orderApiRouter.get("/vouchers/:id", orderController.getOrderById);
orderApiRouter.post("/vouchers", orderController.createOrder);

export default orderApiRouter;
