import { Router } from "express";
import ProductController from "../../controllers/products/productController";

const productsController = new ProductController();
const productRouter = Router();

// Get All Products
productRouter.get("/products", productsController.getAllProducts);
productRouter.get("/products/:id", productsController.getProducDetail);
productRouter.post("/products", productsController.createProduct);
productRouter.put("/products/:id", productsController.updateProduct);

export default productRouter;
