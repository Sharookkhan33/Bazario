const Cart = require("../models/Cart");

// Fetch the logged-in user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;  // Get user from auth middleware

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(400).json({ message: "Cart is empty" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body; // default quantity to 1
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity; // Update quantity if item exists
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error: error.message });
  }
};


  
  exports.removeFromCart = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
  
      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
  
      await cart.save();
      res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
      res.status(500).json({ message: "Error removing item", error: error.message });
    }
  };
  
  exports.clearCart = async (req, res) => {
    try {
      const userId = req.user.id;
      await Cart.findOneAndDelete({ user: userId });
  
      res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
  };
  