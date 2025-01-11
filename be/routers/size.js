import { Router } from "express";
import SizeController from "../controllers/SizeController.js";

const sizeRouter = Router();
const sizeControl = new SizeController();

sizeRouter.get("/sizes", sizeControl.list);
sizeRouter.get("/sizes/:id", sizeControl.detail);
sizeRouter.post("/sizes", sizeControl.create);
sizeRouter.put("/sizes/:id", sizeControl.edit);

export default sizeRouter;