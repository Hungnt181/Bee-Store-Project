import { Router } from "express";
import SizeController from "../../controllers/sizes/SizeController.js";

const sizeRouter = Router();
const sizeControl = new SizeController();

sizeRouter.get("/sizes", sizeControl.list);
sizeRouter.get("/sizes/:id", sizeControl.detail);
sizeRouter.delete("/sizes/:id", sizeControl.remove);
sizeRouter.post("/sizes", sizeControl.create);
sizeRouter.put("/sizes/:id", sizeControl.edit);

export default sizeRouter;
