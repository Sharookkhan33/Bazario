const express = require("express");
const { addReview, getReviews, editReview, deleteReview,getMyReviews } = require("../controllers/reviewController");
const { verifyUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/my", verifyUser, getMyReviews);
router.post("/add", verifyUser, addReview);
router.get("/:productId", getReviews);
router.put("/edit/:reviewId", verifyUser, editReview);
router.delete("/delete/:reviewId", verifyUser, deleteReview);


module.exports = router;
