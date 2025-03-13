import { Router } from "express";
import ProductController from "../../controllers/products/productController";

const productsController = new ProductController();
const productRouter = Router();

productRouter.get("/products/conditions", productsController.getProductWithConditions);
// Get All Products
productRouter.get("/products", productsController.getAllProducts);
// Get product theo categories : Không phải là tất cả biến thể mà đơn giản chỉ là product chính
productRouter.get("/products/category/:id_cate", productsController.getproductsbyCate_id);
// Get product detail
productRouter.get("/products/:id", productsController.getProducDetail);
// Create a new Product
productRouter.post("/products", productsController.createProduct);
//Update a Product
productRouter.put("/products/:id", productsController.updateProduct);
// Xóa mềm sản phẩm
productRouter.patch("/products/status/:id", productsController.updateStatusProduct);

export default productRouter;
