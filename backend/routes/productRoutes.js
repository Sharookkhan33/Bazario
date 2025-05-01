const express = require("express");
const fileUpload = require("../middlewares/fileUpload");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductStatus,
  updateProduct,
  getVendorProducts,
  deleteProduct,
  toggleProductStatus,
  searchProducts,
  getAllProductsForAdmin,
  getSingleProduct,
  updateProductByAdmin
} = require("../controllers/productController");
const { verifyVendor, authAdmin, verifyVendorOrAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",searchProducts);
router.get("/get/:id",getProductById);
router.get("/all",getAllProducts);


// Vendor Routes
router.post("/add", verifyVendor, fileUpload("product").single("image"), addProduct);
router.put('/update/:id', verifyVendor, fileUpload("product").single("image"), updateProduct);
router.get("/vendor", verifyVendor, getVendorProducts);
router.delete("/delete/:id", verifyVendor, deleteProduct);


// Admin Routes
router.put("/status/:id", authAdmin, updateProductStatus);
router.delete("/admin-delete/:id", authAdmin, deleteProduct);
router.get("/admin-products", authAdmin, getAllProductsForAdmin);
router.get("/admin-product/:id", authAdmin, getSingleProduct);
router.put("/admin-update/:id", authAdmin, updateProductByAdmin);

router.put("/toggle-status/:id", verifyVendorOrAdmin, toggleProductStatus);

module.exports = router;
