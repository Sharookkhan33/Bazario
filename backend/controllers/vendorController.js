const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const { comparePassword } = require("../utils/hash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
// Register Vendor
exports.registerVendor = async (req, res) => {
  try {
    const { name, email, phone, password,businessName,businessAddress,gstNumber, bankDetails, documents } = req.body;
    const profilePhoto = req.file ? req.file.path : "";

    const newVendor = new Vendor({
      name,
      email,
      phone,
      password,
      businessName,
      businessAddress,
      gstNumber,
      bankDetails,
      documents,
      profilePhoto,
      status: "pending", // Default status is pending
    });
    await newVendor.save();
    const token = jwt.sign({ id: newVendor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Vendor registration submitted for approval" ,token});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Vendor Login
exports.loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    
    if (vendor.status !== "approved") {
      return res.status(403).json({ message: "Vendor is not approved by admin" });
    }

    const isMatch = await comparePassword(password, vendor.password);
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", vendor.password);
    console.log("Hashing Entered Password for Debugging:", await bcrypt.hash(password, 10));

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.profilePhoto = req.file.path;

    const vendor = await Vendor.findByIdAndUpdate(id, updates, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle Vendor Active Status
exports.toggleVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    // Update all products of the vendor
    await Product.updateMany({ vendor: id }, { stock: vendor.isActive ? 10 : 0 });
    res.status(200).json({ message: "Vendor status updated", vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
