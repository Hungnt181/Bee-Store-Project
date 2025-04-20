import { Router } from "express";
import { createCart, getCartByUser, updateCart } from "../../controllers/carts/cartController";

export const cartRouter = Router();
cartRouter.post("/cart/:idUser/create", createCart);
cartRouter.get("/cart/:idUser", getCartByUser);
cartRouter.patch("/cart/:idUser/update", updateCart);
