const express = require("express");
const {
  registerVendor,
  verifyEmail,
  resendEmailOTP,
  loginVendor,
  updateVendor,
  toggleVendorStatus,
  getVendorProfile,
  getVendorDashboard
} = require("../controllers/vendorController");
const profileUpload = require("../middlewares/profileUploads");
const { verifyVendor } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", profileUpload.single("profilePhoto"), registerVendor);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendEmailOTP);
router.post("/login", loginVendor);
router.put("/update", profileUpload.single("profilePhoto"), verifyVendor, updateVendor);
router.get("/profile", verifyVendor, getVendorProfile);
router.get("/dashboard", verifyVendor, getVendorDashboard);
router.put("/status", verifyVendor, toggleVendorStatus);

// ✅ Clean, focused vendor status route
router.get("/me", verifyVendor, (req, res) => {
  const vendor = req.vendor;

  if (vendor.status === "rejected") {
    return res.status(403).json({
      message: "Account rejected",
      rejectionReason: vendor.rejectionMessage || "Your account has been deactivated",
    });
  }

  res.status(200).json({ status: "active" });
});

module.exports = router;
