const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
      stock: { type: Number, required: true },
      isActive: { type: Boolean, default: true },
      colour: { type: String },
      rejectionMessage: { type: String, default: "" },// Optional field to connect products of different colors
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // Admin approval for listing
    },
    { timestamps: true }
  );
  
  const Product = mongoose.model("Product", ProductSchema);
  module.exports = Product;
  