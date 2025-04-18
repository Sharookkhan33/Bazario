const express = require("express");
const { getCart, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/", verifyUser, getCart);
router.post("/add", verifyUser, addToCart);
router.delete("/remove/:productId", verifyUser, removeFromCart);
router.delete("/clear", verifyUser, clearCart);

module.exports = router;