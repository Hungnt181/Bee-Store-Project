import { Router } from "express";
import {
  addBanner,
  deleteBanner,
  listBanners,
  toggleBannerStatus,
} from "../../controllers/banners/bannerController";

export const bannerRouter = Router();

bannerRouter.get("/banners", listBanners);
bannerRouter.post("/banners", addBanner);
bannerRouter.delete("/banners/:id", deleteBanner);
bannerRouter.patch("/banners/:id/toggle-status", toggleBannerStatus);
