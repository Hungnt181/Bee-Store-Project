import { Router } from "express";
import VariantController from "../../controllers/variants/variantController";

const variantsController = new VariantController();
const variantRouter = Router();

// Get All Variants
variantRouter.get("/variants", variantsController.getAllVariants);
// Get Variants by id_variant
variantRouter.get(
  "/variants/:id_variant",
  variantsController.getAllVariantById_Variant
);
// Get All Variants by id_cate
variantRouter.get(
  "/variants/category/:id_cate",
  variantsController.getVariantsByCateID
);
// Get All Variants by id_product
variantRouter.get(
  "/variants/product/:id_product",
  variantsController.getVariantsByProID
);
// Create a new variant
variantRouter.post("/variants", variantsController.createVariant);
// Create a new variant
variantRouter.put("/variants/:id", variantsController.updateVariant);
// Update Status Variant
variantRouter.patch(
  "/variants/status/:id",
  variantsController.updateStatusVariant
);
// Update Status Variant
variantRouter.patch("/variants/:id", variantsController.removeImageVariant);

export default variantRouter;
