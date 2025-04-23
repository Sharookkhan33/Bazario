const express = require("express");
const productUpload = require("../middlewares/productUploads");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductStatus,
  updateProduct,
  getVendorProducts,
  deleteProduct,
  toggleProductStatus,
  searchProducts
} = require("../controllers/productController");
const { verifyVendor, authAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",searchProducts);
router.get("/get/:id",getProductById);
router.get("/all",getAllProducts);

// Vendor Routes
router.post("/add", verifyVendor, productUpload.single("image"), addProduct);
router.put('/update/:id', verifyVendor, productUpload.single("image"), updateProduct);
router.get("/vendor", verifyVendor, getVendorProducts);
router.delete("/delete/:id", verifyVendor, deleteProduct);
router.put("/toggle-status/:id", verifyVendor, toggleProductStatus);

// Admin Routes
router.put("/status/:id", authAdmin, updateProductStatus);
router.delete("/admin-delete/:id", authAdmin, deleteProduct);
router.put("/admin-toggle-status/:id", authAdmin, toggleProductStatus);
module.exports = router;
