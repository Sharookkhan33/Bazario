const Review = require("../models/Review");
const Order = require("../models/Order")
const Product = require("../models/Product");


const updateProductReviews = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, { averageRating: 0, reviews: [] });
      return;
    }

    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(avgRating.toFixed(1)),
      reviews: reviews.map((r) => r._id),
    });
  } catch (error) {
    console.error("Error updating product reviews:", error);
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has purchased and received this product
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      "items.product": productId,
      status: "delivered",
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "You can only review purchased products" });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user.id, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    await review.save();

    // ✅ Update product rating
    await updateProductReviews(productId);

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  
  // Get all reviews for a product
  exports.getReviews = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const reviews = await Review.find({ product: productId })
        .populate("user", "name") // populate only 'name' from User model
        .select("rating comment productImage createdAt user") // also select 'user' field!
        .sort({ createdAt: -1 }); // (optional) newest first
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not fetch reviews" });
    }
  };
  
// Edit a review
exports.editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, productImage, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: req.user.id });
    if (!review) {
      return res.status(404).json({ message: "Review not found or not authorized" });
    }

    review.rating = rating;
    review.productImage = productImage;
    review.comment = comment;
    await review.save();

    // ✅ Update product rating after editing review
    await updateProductReviews(review.product);

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, user: req.user.id });
    if (!review) {
      return res.status(404).json({ message: "Review not found or not authorized" });
    }

    const productId = review.product; // Save before deletion
    await review.deleteOne();

    // ✅ Update product rating after deleting review
    await updateProductReviews(productId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate("product", "name image")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch your reviews" });
  }
};
