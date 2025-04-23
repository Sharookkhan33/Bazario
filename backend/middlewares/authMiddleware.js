const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Vendor = require("../models/Vendor");
const User = require("../models/User")

// Verify Vendor Middleware
exports.verifyVendor = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) return res.status(403).json({ message: "Access denied - Vendor not found" });

    if (vendor.status === 'rejected' || !vendor.isActive) {
      return res.status(403).json({ message: 'Your account is suspended. Please contact admin.' });
    }
    // Store admin info in request
    req.vendor= vendor;

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Verify Admin Middleware
exports.authAdmin = async (req, res, next) => {
  try {
    // Extract Bearer token
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return res.status(400).json({ message: "Invalid token" });

    // Find admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(403).json({ message: "Access denied - Admin not found" });

    // Store admin info in request
    req.admin = admin;

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

// Verify User

exports.verifyUser = async (req, res, next) => {
  try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(403).json({ message: "User not found" });

      req.user = user; // Attach user data to request
      next();
  } catch (error) {
      res.status(400).json({ message: "Invalid token" });
  }
};

exports. verifyVendorOrAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return res.status(400).json({ message: "Invalid token" });

    // Try to find the user in Vendor collection
    const vendor = await Vendor.findById(decoded.id);
    if (vendor) {
      req.vendor = vendor;
      return next();
    }

    // Try to find the user in Admin collection
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.admin = admin;
      return next();
    }

    return res.status(403).json({ message: "Access denied - Not Vendor or Admin" });
  } catch (error) {
    console.error("verifyVendorOrAdmin Error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};
