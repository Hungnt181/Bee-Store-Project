import { Router } from "express";
import { createCart, getCartByUser, updateCart } from "../../controllers/carts/cartController";

export const cartRouter = Router();
cartRouter.post("/cart", createCart);
cartRouter.get("/cart/:idUser", getCartByUser);
cartRouter.put("/cart/:id", updateCart);
