import { Router } from "express";
import { createCart, deleteCartItem, getCartByUser, updateCart, updateCart2, updateCartItems, updateItemQuantity } from "../../controllers/carts/cartController";

export const cartRouter = Router();
cartRouter.post("/cart/:idUser/create", createCart);
cartRouter.get("/cart/:idUser", getCartByUser);
cartRouter.patch("/cart/:idUser/update", updateCart);//co san check trung
cartRouter.patch("/cart/:idUser/update2", updateCart2);//recommend
cartRouter.patch("/cart/:idUser/updateQuantity/:idVariant", updateItemQuantity);
cartRouter.patch("/cart/:idUser/updateItems", updateCartItems);
cartRouter.patch("/cart/:idUser/delete/:idVariant", deleteCartItem);
