import { Router } from "express";
import { add, detail, edit, list, remove } from "./controllers/payments/PaymentController";

export const paymentRouter=Router();
paymentRouter.post("/payments", add);
paymentRouter.get("/payments", list);
paymentRouter.get("/payments/:id", detail);
paymentRouter.delete("/payments/:id", remove);
paymentRouter.put("/payments/:id", edit);