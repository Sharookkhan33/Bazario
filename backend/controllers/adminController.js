const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Product = require("../models/Product")
const { generateOTP, sendVerificationEmail } = require("../services/emailService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Get all Vendors
exports.getAllVendors = async (req, res) => {
  try {
      if (!req.admin) {
          return res.status(403).json({ message: "Access denied. Admin only." });
      }

      const vendors = await Vendor.find().select("-password");
      res.status(200).json(vendors);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

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

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email,phoneNumber, password,secretKey} = req.body;
    

     if (secretKey != process.env.ADMIN_SECRET_KEY) {
      console.log(secretKey)
      console.log(process.env.ADMIN_SECRET_KEY)
     return res.status(403).json({ message: "Unauthorized" });
     }
     else{
      console.log("authorized")
     }

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
      phoneNumber,
      emailOTP,
      emailVerified: false,
      isVerified:false
    });

    await admin.save();

    // Send OTP via email
    await sendVerificationEmail(email, emailOTP);

    res.status(201).json({ message: "OTP sent to email"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, emailOTP } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check OTP
    if (admin.emailOTP !== emailOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified
    admin.emailVerified = true;
    admin.emailOTP = null;
    admin.isVerified = true;

    await admin.save();

    res.status(200).json({ message: "Email verified successfully" });
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

        const token = jwt.sign(
  { id: admin._id, userType: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);


        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Delete user

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all Users
exports.getAllUsers = async (req, res) => {
  try {
      if (!req.admin) {
          return res.status(403).json({ message: "Access denied. Admin only." });
      }

      const users = await User.find().select("-password");
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
//dash board

exports.getAdminDashboard = async (req, res) => {
  try {
    // Total counts
    const totalUsers    = await User.countDocuments();
    const totalVendors  = await Vendor.countDocuments();
    const totalOrders   = await Order.countDocuments();

    // Earnings
    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalEarnings = totalPayments[0]?.total || 0;

    // Pending counts
    const pendingVendors  = await Vendor.countDocuments({ status: "pending" });
    const pendingProducts = await Product.countDocuments({ status: "pending" });

    // Orders grouped by month
    const orderTrends = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              [
                "Jan","Feb","Mar","Apr","May","Jun",
                "Jul","Aug","Sep","Oct","Nov","Dec"
              ],
              { $subtract: ["$_id", 1] }
            ]
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.status(200).json({
      totalUsers,
      totalVendors,
      totalOrders,
      totalEarnings,
      pendingVendors,
      pendingProducts,
      ordersByMonth: orderTrends,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ error: error.message });
  }
};


// Suspend or unsuspend a user
exports.toggleUserSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.suspended = !user.suspended;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.suspended ? "suspended" : "unsuspended"} successfully.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
