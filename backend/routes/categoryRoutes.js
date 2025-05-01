// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const fileUpload = require("../middlewares/fileUpload");
const { authAdmin } = require("../middlewares/authMiddleware");
const {
  createCategory,
  getCategories,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.get("/all", authAdmin, getAllCategories);
router.post(
  "/create",
  authAdmin,
  fileUpload("category").single("image"),
  createCategory
);
router.put(
  "/update/:id",
  authAdmin,
  fileUpload("category").single("image"),
  updateCategory
);
router.delete("/:id", authAdmin, deleteCategory);

module.exports = router;
