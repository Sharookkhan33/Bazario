const express = require("express");
const {
  addProduct,
  getAllProducts,
  updateProductStatus,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} = require("../controllers/productController");
const { verifyVendor, authAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/all",getAllProducts);
// Vendor Routes
router.post("/add", verifyVendor, addProduct);
router.put("/update/:id", verifyVendor, updateProduct);
router.delete("/delete/:id", verifyVendor, deleteProduct);
router.put("/toggle-status/:id", verifyVendor, toggleProductStatus);

// Admin Routes
router.put("/status/:id", authAdmin, updateProductStatus);
router.delete("/admin-delete/:id", authAdmin, deleteProduct);
router.put("/admin-toggle-status/:id", authAdmin, toggleProductStatus);
module.exports = router;
