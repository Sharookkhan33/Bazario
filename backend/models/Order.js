const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }, // Price * Quantity
});

const orderSchema = new mongoose.Schema({
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered","cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
orderSchema.add({
  statusHistory: [{
    status: { type: String },
    changedAt: { type: Date, default: Date.now },
  }]
});


module.exports = mongoose.model("Order", orderSchema);
