const Product = require("../models/Product");

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product({...req.body, vendor: req.vendor.id});
    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name email");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Product status (Approve/Reject)
exports.updateProductStatus = async (req, res) => {
  try {
    // Ensure only admins can perform this action
    if (!req.admin) {
      return res.status(403).json({ message: "Access denied - Admins only" });
    }

    const { id } = req.params;
    const { status, message } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status;
    if (status === "rejected") {
      product.rejectionMessage = message; // Store reason for rejection
    }

    await product.save();

    res.status(200).json({ message: `Product ${status}`, product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Update product details
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, vendor: req.vendor.id }); // Ensure vendor owns the product
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    Object.assign(product, req.body);
    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      // Vendors can delete their own products, Admins can delete any
      if (!req.admin && (!req.vendor || product.vendor.toString() !== req.vendor._id.toString())) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      await product.deleteOne();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
    

  exports.toggleProductStatus = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the product by ID
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      // Allow access only if:
      // 1. The requester is an admin (req.admin exists)
      // 2. OR the requester is the vendor who owns the product
      if (!req.admin && (!req.vendor || product.vendor.toString() !== req.vendor.id)) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      // Toggle product status
      product.isActive = !product.isActive;
      product.stock = product.isActive ? 10 : 0; // Adjust stock
      await product.save();
  
      res.status(200).json({ message: "Product status updated", product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  