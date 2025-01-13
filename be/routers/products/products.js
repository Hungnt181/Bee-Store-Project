import { Router } from "express";
import ProductController from "../../controllers/products/productController";

const productsController = new ProductController();
const productRouter = Router();

// Get All Products
productRouter.get("/products", productsController.getAllProducts);
// Get product theo categories : Không phải là tất cả biến thể mà đơn giản chỉ là product chính
productRouter.get(
  "/products/category/:id_cate",
  productsController.getprodcutsbyCate_id
);
// Get product detail
productRouter.get("/products/:id", productsController.getProducDetail);

// Create a new Product
productRouter.post("/products", productsController.createProduct);

//Update a Product
productRouter.put("/products/:id", productsController.updateProduct);

export default productRouter;
