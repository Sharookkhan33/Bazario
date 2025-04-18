const express = require("express");
const { createCheckoutSession, confirmPayment } = require("../controllers/paymentController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Route to create a Stripe Checkout session
router.post("/checkout-session", verifyUser, createCheckoutSession);

// ✅ Route to confirm payment after successful checkout
router.post("/confirm-payment", verifyUser, confirmPayment);

module.exports = router;