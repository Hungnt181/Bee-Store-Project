import { Router } from "express";
import cateRouter from "./categories.js";
import sizeRouter from "./size.js";

const router = Router();

router.use("/api", cateRouter);
router.use("/api", sizeRouter);

export default router