const express = require("express");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const { verifyUser } = require("../middlewares/authMiddleware"); // Ensure user is logged in

const router = express.Router();

// Wishlist Routes
router.post("/add", verifyUser, addToWishlist);
router.get("/", verifyUser, getWishlist);
router.delete("/remove", verifyUser, removeFromWishlist);

module.exports = router;
