const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User")

// controllers/orderController.js
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
        const product = await Product.findById(item.product).populate("vendor");
        if (!product) throw new Error(`Product not found: ${item.product}`);

        const priceAfterDiscount = product.discount
          ? (product.price - (product.price * product.discount) / 100).toFixed(2)
          : product.price.toFixed(2);

        const subtotal = priceAfterDiscount * item.quantity;
        totalAmount += parseFloat(priceAfterDiscount) * item.quantity;

        return {
          product: product._id,
          vendor: product.vendor._id,
          name: product.name,
          price: priceAfterDiscount, // Store the price after discount
          quantity: item.quantity,
          subtotal: subtotal,
          discount: product.discount, // Store the discount in the order item
        };
      })
    );

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount: totalAmount.toFixed(2), // Ensure total amount is saved as a fixed value
      status: "pending",
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
    const orders = await Order.find({ user: req.user.id }).populate("items")
    .populate("items.product", "name image")
    .sort({ createdAt: -1 });
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
    .populate('items.product') 
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
    order.statusHistory.push({ status });
    
    await order.save();

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
