import { Router } from "express";
import OrderController from "../../controllers/orders/OrderController";

const orderApiRouter = Router();

orderApiRouter.get('/orders', OrderController.getOrders); 
orderApiRouter.get('/vouchers/:id', OrderController.getOrderById); 
orderApiRouter.post('/vouchers', OrderController.createOrder);

export default orderApiRouter;