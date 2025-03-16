import { Router } from "express";
import OrderController from "../../controllers/orders/OrderController.js";

const orderController = new OrderController();
const orderApiRouter = Router();

orderApiRouter.get("/orders", orderController.getOrders);
orderApiRouter.get("/orders/:id", orderController.getOrderById);
orderApiRouter.get("/orders/user/:id_user", orderController.getOrdersByUser);
orderApiRouter.post("/orders", orderController.createOrder);
orderApiRouter.patch("/orders/:id", orderController.updateStatusByAdmin);
orderApiRouter.patch(
  "/orders/client/:id",
  orderController.updateStatusByClient
);
orderApiRouter.patch(
  "/orders/client/confirm/:id",
  orderController.updateIsConnfirmByClient
);

export default orderApiRouter;
