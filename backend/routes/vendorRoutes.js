const express = require("express");
const { registerVendor,verifyEmail,resendEmailOTP,loginVendor, updateVendor, toggleVendorStatus,getVendorProfile,getVendorDashboard } = require("../controllers/vendorController");
const upload = require("../middlewares/upload");
const {verifyVendor}= require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), registerVendor);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendEmailOTP);
router.post("/login", loginVendor);
router.put("/update", upload.single("profilePhoto"),verifyVendor, updateVendor);
router.get("/profile", verifyVendor, getVendorProfile);
router.get("/dashboard", verifyVendor, getVendorDashboard);
router.put("/status",verifyVendor,toggleVendorStatus);

module.exports = router;
