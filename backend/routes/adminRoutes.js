const express = require("express");
const { approveVendor, toggleVendorStatus,registerAdmin,verifyEmail,loginAdmin,deleteUser,toggleUserSuspension,getAllUsers,getAllVendors,getAdminDashboard} = require("../controllers/adminController");
const { authAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/verify-email", verifyEmail);
router.post("/login", loginAdmin);
router.put("/approve/:id",authAdmin, approveVendor);
router.put("/toggle-status/:id",authAdmin, toggleVendorStatus);
router.get("/all-vendors", authAdmin, getAllVendors);
router.delete("/delete-user/:id",authAdmin,deleteUser);
router.get("/all-users", authAdmin, getAllUsers);
router.put("/suspend-user/:id", authAdmin, toggleUserSuspension);
router.get("/dashboard", authAdmin, getAdminDashboard);


module.exports = router;
