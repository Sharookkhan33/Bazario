const express = require("express");
const { approveVendor, toggleVendorStatus,registerAdmin,verifyAdmin,loginAdmin} = require("../controllers/adminController");
const { authAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-admin", verifyAdmin);
router.post("/login", loginAdmin);
router.put("/approve/:id",authAdmin, approveVendor);
router.put("/toggle-status/:id",authAdmin, toggleVendorStatus);
router

module.exports = router;
