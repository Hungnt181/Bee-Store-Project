import { Router } from "express";
import ItemOrderController from "../../controllers/itemOrder/itemOrderController";

const itemOrderController = new ItemOrderController();
const itemOrderRouter = Router();
// ADD  item Order
itemOrderRouter.post("/itemOrder", itemOrderController.addItemOrder);
// Get All item Order
itemOrderRouter.get("/itemOrder", itemOrderController.getAllItemOrder);
export default itemOrderRouter;
