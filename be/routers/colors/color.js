import { Router } from "express";
import {
  add,
  detail,
  edit,
  list,
  remove,
} from "../../controllers/colors/ColorController";

export const colorRouter = Router();
colorRouter.post("/colors", add);
colorRouter.get("/colors", list);
colorRouter.get("/colors/:id", detail);
colorRouter.delete("/colors/:id", remove);
colorRouter.put("/colors/:id", edit);
