const Product = require("../models/Product");
const mongoose = require("mongoose");


// Add a new product
exports.addProduct = async (req, res) => {
  try {
    let image;

    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      ...req.body,
      vendor: req.vendor.id,
      image, // 👈 assign image here
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Add Product Error:", error);
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

// Get single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
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
exports.getVendorProducts = async (req, res) => {
  try {
    
    const vendorId = req.vendor.id;
    
    const products = await Product.find({ vendor: vendorId });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update product details
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, vendor: req.vendor.id });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    // Handle image if new one is uploaded
    if (req.file) {
      req.body.image = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
    }

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
  //search and filtering
  exports.searchProducts = async (req, res) => {
    try {
      const { search, category, minPrice, maxPrice, averageRating } = req.query;
      const query = {};
  
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      if (category) {
        query.category = category;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (averageRating) {
        query.averageRating = { $gte: Number(averageRating) };
      }
  
      const products = await Product.find(query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };                
  exports.getAllProductsForAdmin = async (req, res) => {
    try {
      const { status, isActive, category, vendor, search } = req.query;
      const query = {};
  
      if (status) query.status = status;
      if (isActive) query.isActive = isActive === "true";
      if (category) query.category = category;
      if (vendor) query.vendor = vendor;
      if (search) query.name = { $regex: search, $options: "i" };
  
      const products = await Product.find(query)
        .populate("vendor", "name email")
        .sort({ createdAt: -1 });
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getSingleProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate("vendor", "name email")
        .populate("reviews");
  
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.updateProductByAdmin = async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.status(200).json({ message: "Product updated", product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  