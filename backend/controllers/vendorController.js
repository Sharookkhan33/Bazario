const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { generateOTP, sendVerificationEmail } = require("../services/emailService");
const { comparePassword } = require("../utils/hash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
// Register Vendor
exports.registerVendor = async (req, res) => {
  try {
    const { name, email, phone, password,businessName,businessAddress,gstNumber, bankDetails, documents } = req.body;
    const profilePhoto = req.file ? req.file.path : "";

       // Check if Vendor already exists
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) return res.status(400).json({ message: "Vendor already registered" });
    
        // Generate OTP
      const emailOTP = generateOTP();

      const newVendor = new Vendor({
      name,
      email,
      phone,
      password,
      emailOTP,
      emailVerified: false,
      isVerified:false,
      businessName,
      businessAddress,
      gstNumber,
      bankDetails,
      documents,
      profilePhoto,
      status: "pending", // Default status is pending
    });
    await newVendor.save();
    await sendVerificationEmail(email, emailOTP);
    const token = jwt.sign({ id: newVendor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "OTP sent to email"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { email, emailOTP } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.emailOTP !== emailOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    vendor.emailVerified = true;
    vendor.emailOTP = null;
    vendor.isVerified = true;
    res.status(200).json({ message: "Vendor email verified successfully" });

    await vendor.save();

    res.status(200).json({ message: "Registration Submitted, Wait for the approval" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Generate and update new OTP
    const newOTP = generateOTP();
    vendor.emailOTP = newOTP;
    await vendor.save();

    // Send OTP via email
    await sendVerificationEmail(email, newOTP);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
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

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: vendor._id, userType: 'vendor' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 

// Update Vendor Profile
exports.updateVendor = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      businessName: req.body.businessName,
      businessAddress: req.body.businessAddress,
      gstNumber: req.body.gstNumber,
      bankDetails: {
        accountHolderName: req.body.accountHolderName,
        bankName: req.body.bankName,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
      },
    };

    // ✅ Save profile photo path from "uploads/profiles"
    if (req.file) {
      const filename = req.file.filename;
      const photoPath = path.join('uploads/profiles', filename).replace(/\\/g, '/');
      updates.profilePhoto = photoPath;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedVendor);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


//Vendor Profile

exports.getVendorProfile = async (req, res) => {
  try {
      const vendor = await Vendor.findById(req.vendor.id).select("-password");
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      res.status(200).json(vendor);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Toggle Vendor Active Status
exports.toggleVendorStatus = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    // Update all products of the vendor
    await Product.updateMany({ vendor: vendorId }, { stock: vendor.isActive ? 10 : 0 });
    res.status(200).json({ message: "Vendor status updated", vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//dash board
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    const totalOrders = await Order.countDocuments({ "items.vendor": vendorId });
    const pendingOrders = await Order.countDocuments({ "items.vendor": vendorId, status: "pending" });

    const orders = await Order.find({ "items.vendor": vendorId });
    let totalRevenue = 0;
    const productPerformance = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.vendor.toString() === vendorId) {
          totalRevenue += item.subtotal;
          if (!productPerformance[item.product]) {
            productPerformance[item.product] = {
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
          }
          productPerformance[item.product].quantity += item.quantity;
          productPerformance[item.product].revenue += item.subtotal;
        }
      });
    });

    res.status(200).json({ totalOrders, pendingOrders, totalRevenue, productPerformance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};