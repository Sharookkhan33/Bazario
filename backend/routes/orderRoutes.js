const express = require("express");
const { placeOrder, getOrdersByUser, getOrdersByVendor, updateOrderStatus ,getAllOrders} = require("../controllers/orderController");
const { verifyUser,verifyVendor,verifyVendorOrAdmin, authAdmin } = require("../middlewares/authMiddleware"); 

const router = express.Router();

// Place a new order (User)
router.post("/place-order", verifyUser, placeOrder);

// Get all orders for a user
router.get("/user-orders", verifyUser, getOrdersByUser);

// Get all orders for a vendor
router.get("/vendor-orders", verifyVendor, getOrdersByVendor);

// Update order status (Vendor/Admin)
router.put("/update-status/:orderId", verifyVendorOrAdmin, updateOrderStatus);

// Get all orders (Admin only)
router.get("/all", authAdmin, getAllOrders);

module.exports = router;
