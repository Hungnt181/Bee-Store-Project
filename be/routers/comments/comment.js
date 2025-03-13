import { Router } from "express";
import {
  list,
  detail,
  remove,
  createComment,
  toggleCommentStatus,
} from "../../controllers/comments/commentController.js";

export const commentRouter = Router();
commentRouter.get("/comments", list);
commentRouter.get("/comments/:id", detail);
commentRouter.delete("/comments/:id", remove);
commentRouter.post("/comments", createComment);
commentRouter.patch("/comments/:id/toggle-status", toggleCommentStatus);
