const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const { sendVerificationEmail } = require("../services/emailService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Approve or Reject Vendor with a Rejection Message
exports.approveVendor = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, rejectionMessage } = req.body;
  
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      const updateData = {
        status,
        rejectionMessage: status === "rejected" ? rejectionMessage || "No reason provided" : "",
      };
  
      const vendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  
      res.status(200).json({ message: `Vendor ${status}`, vendor });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// Activate or Deactivate Vendor
exports.toggleVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    // Update all products of this vendor
    await Product.updateMany({ vendor: id }, { inStock: vendor.isActive });

    res.status(200).json({ message: `Vendor ${vendor.isActive ? "activated" : "deactivated"}`, vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const emailOTP = generateOTP();


    // Create admin with OTP
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      emailOTP,
      isVerified: false,
    });

    await admin.save();

    // Send OTP via email
    await sendVerificationEmail(email, emailOTP);

    res.status(201).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyAdmin = async (req, res) => {
  try {
    const { email, emailOTP } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check OTP
    if (admin.emailOTP !== emailOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified
    admin.isVerified = true;
    admin.emailOTP = null;
    await admin.save();

    res.status(200).json({ message: "Admin verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        if (!admin.isVerified) return res.status(403).json({ message: "Admin is not verified" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
