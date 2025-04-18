const Wishlist = require("../models/Wishlist");

// ✅ Add a product to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get the logged-in user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in user ID
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    if (!wishlist) return res.status(404).json({ message: "Wishlist is empty" });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Remove a product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    if (!wishlist.products || wishlist.products.length === 0) {
      return res.status(400).json({ message: "Wishlist is empty" });
    }
    
    wishlist.products = wishlist.products.filter((id) => id?.toString() !== productId);
    
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
