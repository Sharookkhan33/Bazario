const express = require("express");
const { registerVendor, loginVendor, updateVendor, toggleVendorStatus } = require("../controllers/vendorController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), registerVendor);
router.post("/login", loginVendor);
router.put("/update/:id", upload.single("profilePhoto"), updateVendor);
router.put("/status/:id", toggleVendorStatus);

module.exports = router;
