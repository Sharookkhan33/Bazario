// controllers/categoryController.js
const Category = require("../models/Category");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, subtitle, slug, isActive } = req.body;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path, "marketplace/categories");
    }
    if (!imageUrl) return res.status(400).json({ message: "Image is required" });

    const category = new Category({ name, subtitle, slug, isActive, image: imageUrl });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get only active categories for frontend
exports.getCategories = async (req, res) => {
  const cats = await Category.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(cats);
};

// (Admin) Get all categories
exports.getAllCategories = async (req, res) => {
  const cats = await Category.find().sort({ createdAt: -1 });
  res.json(cats);
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { name, subtitle, slug, isActive } = req.body;
    let imageUrl = req.body.image;
    const existing = await Category.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    // If new file, upload & delete old Cloud
    if (req.file) {
      // extract publicId from URL if needed, optional
      imageUrl = await uploadToCloudinary(req.file.path, "marketplace/categories");
      // await deleteFromCloudinary(oldPublicId);
    }

    existing.set({ name, subtitle, slug, isActive, image: imageUrl });
    await existing.save();
    res.json(existing);
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
