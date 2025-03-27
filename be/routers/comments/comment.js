import { Router } from "express";
import {
  list,
  detail,
  remove,
  createComment,
  toggleCommentStatus,
  getCommentsByProduct,
} from "../../controllers/comments/commentController.js";

export const commentRouter = Router();
commentRouter.get("/comments", list);
commentRouter.get("/comments/:id", detail);
commentRouter.delete("/comments/:id", remove);
commentRouter.post("/comments", createComment);
commentRouter.patch("/comments/:id/toggle-status", toggleCommentStatus);
commentRouter.get("/comments/product/:id_product", getCommentsByProduct);
