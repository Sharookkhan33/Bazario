const express = require("express");
const { createCheckoutSession, confirmPayment,getMyPayments } = require("../controllers/paymentController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Route to create a Stripe Checkout session
router.post("/checkout-session", verifyUser, createCheckoutSession);

// ✅ Route to confirm payment after successful checkout
router.post("/confirm-payment", verifyUser, confirmPayment);
router.get("/my", verifyUser, getMyPayments);

module.exports = router;