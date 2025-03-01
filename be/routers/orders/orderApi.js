import { Router } from "express";
import OrderController from "../../controllers/orders/OrderController.js";

const orderController = new OrderController();
const orderApiRouter = Router();

orderApiRouter.get("/orders", orderController.getOrders);
orderApiRouter.get("/orders/:id", orderController.getOrderById);
orderApiRouter.post("/orders", orderController.createOrder);
orderApiRouter.patch("/orders/:id", orderController.updateStatusByAdmin);
orderApiRouter.patch(
  "/orders/client/:id",
  orderController.updateStatusByClient
);

export default orderApiRouter;
