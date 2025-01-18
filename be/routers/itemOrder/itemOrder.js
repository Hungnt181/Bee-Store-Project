import { Router } from "express";
import ItemOrderController from "../../controllers/itemOrder/itemOrderController";

const itemOrderController = new ItemOrderController();
const itemOrderRouter = Router();

// Get All item Order
itemOrderRouter.get("/itemOrder", itemOrderController.getAllItemOrder);
export default itemOrderRouter;
