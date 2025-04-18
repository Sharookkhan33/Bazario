const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User")

exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    let totalAmount = 0;

    // Fetch product details and calculate total amount
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product).populate("vendor"); // ✅ Fixed
        if (!product) throw new Error(`Product not found: ${item.product}`);

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        return {
          product: product._id,
          vendor: product.vendor._id, // ✅ Store vendor per item
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal
        };
      })
    );
    

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      status: "pending"
    });

    if (shippingAddress !== req.user.shippingAddress) {
      req.user.shippingAddress = shippingAddress;
      await req.user.save();
    }
        
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Orders by User
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items");
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Orders by Vendor
exports.getOrdersByVendor = async (req, res) => {
  try {
    const vendorId = req.vendor.id; 
    const orders = await Order.find({ 'items.vendor': vendorId })
      .populate('items.product', 'name price') 
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this vendor.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ error: error.message });
  }
};


// Update Order Status (Vendor/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if(order.paymentStatus=="pending") return res.status(400).json({message:"Payment is pending"})
    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
