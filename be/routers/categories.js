import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";

const cateRouter = Router();
const cateControl = new CategoryController();

cateRouter.get("/categories", cateControl.list);
cateRouter.get("/categories/:id", cateControl.detail);
cateRouter.post("/categories", cateControl.create);
cateRouter.put("/categories/:id", cateControl.edit);

export default cateRouter;