const express = require("express");
const { registerVendor,verifyEmail,resendEmailOTP,loginVendor, updateVendor, toggleVendorStatus,getVendorProfile,getVendorDashboard } = require("../controllers/vendorController");
const profileUpload = require("../middlewares/profileUploads");
const {verifyVendor}= require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/register", profileUpload.single("profilePhoto"), registerVendor);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendEmailOTP);
router.post("/login", loginVendor);
router.put("/update",profileUpload.single("profilePhoto"),verifyVendor,updateVendor);
router.get("/profile", verifyVendor, getVendorProfile);
router.get("/dashboard", verifyVendor, getVendorDashboard);
router.put("/status",verifyVendor,toggleVendorStatus);
router.get('/me', verifyVendor, async (req, res) => {
    try {
      res.status(200).json(req.vendor);
    } catch (error) {
      res.status(500).json({ message: 'Unable to fetch vendor data' });
    }
  });

module.exports = router;
