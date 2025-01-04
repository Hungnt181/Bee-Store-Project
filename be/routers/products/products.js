import { Router } from "express";
import ProductController from "../../controllers/products/productController";

const productsController = new ProductController();
const productRouter = Router();

// Get All Products
productRouter.get("/products", productsController.getAllProducts);
productRouter.post("/products", productsController.createProduct);

export default productRouter;
