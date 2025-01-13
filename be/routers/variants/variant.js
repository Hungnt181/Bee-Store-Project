import { Router } from "express";
import VariantController from "../../controllers/variants/variantController";

const variantsController = new VariantController();
const variantRouter = Router();

// Get All Variants
variantRouter.get("/variants", variantsController.getAllVariants);

// Get All Variants by id_cate
variantRouter.get(
  "/variants/category/:id_cate",
  variantsController.getVariantsByCateID
);
// Get All variants by id_product
variantRouter.get(
  "/variants/product/:id_product",
  variantsController.getVariantsByProductID
);
// Get All variants by id_size
variantRouter.get(
  "/variants/size/:id_size",
  variantsController.getVariantsBySizeID
);
// Get All variants by id_color
variantRouter.get(
  "/variants/color/:id_color",
  variantsController.getVariantsByColorID
);

// Create a new variant
variantRouter.post("/variants", variantsController.createVariant);
// Create a new variant
variantRouter.put("/variants/:id", variantsController.updateVariant);

export default variantRouter;
