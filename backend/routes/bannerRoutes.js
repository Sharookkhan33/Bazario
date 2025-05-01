const express = require("express");
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
  getAdminBanners
} = require("../controllers/bannerController.js");
const { authAdmin } = require ("../middlewares/authMiddleware.js");
const fileUpload = require("../middlewares/fileUpload");

const router = express.Router()
router.get("/all", getBanners);
router.get("/admin-all",authAdmin, getAdminBanners);
router.post("/create-banner", authAdmin, fileUpload("banner").single("image"), createBanner);
router.put("/update/:id", authAdmin, fileUpload("banner").single("image"), updateBanner);
router.delete("/:id", authAdmin, deleteBanner);
router.put("/status/:id", authAdmin, updateBannerStatus);

module.exports = router;
