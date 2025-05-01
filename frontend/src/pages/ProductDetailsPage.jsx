import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from 'react-icons/fa';
import { AuthContext } from "../context/AuthContext";

// Material Tailwind
import {
  Button,
  Card,
  CardBody,
  Typography,
  Textarea,
  Spinner,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Rating,
} from "@material-tailwind/react";

const dummyProfileImage = "https://via.placeholder.com/50";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const productResponse = await api.get(`/products/get/${id}`);
          setProduct(productResponse.data.product);
        } catch (err) {
          setError('Failed to load product details');
        } finally {
          setIsLoading(false);
        }
      };

      const fetchReviews = async () => {
        try {
          const response = await api.get(`/review/${id}`);
          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews", error);
        }
      };

      fetchProduct();
      fetchReviews();
      fetchWishlistStatus();
    }
  }, [id]);

  const fetchWishlistStatus = async () => {
    if (isLoggedIn) {
      try {
        const response = await api.get('/wishlist', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const products = response.data.products || [];
        setWishlisted(products.some(item => item._id === id));
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to the cart');
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart/add', { productId: product._id, quantity: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.error('Please log in to buy the product');
      navigate('/login');
      return;
    }
    navigate(`/checkout`, { state: { cartItems: [{ product, quantity: 1 }] } });
  };

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to wishlist');
      navigate('/login');
      return;
    }
    try {
      if (wishlisted) {
        await api.delete('/wishlist/remove', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          data: { productId: product._id },
        });
        toast.success('Removed from wishlist');
      } else {
        await api.post('/wishlist/add', { productId: product._id }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Added to wishlist');
      }
      setWishlisted(!wishlisted);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddReview = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add a review');
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(
        '/review/add',
        { productId: id, rating: newReview.rating, comment: newReview.comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Review added successfully');
      setReviews([response.data.review, ...reviews]);
      setNewReview({ rating: 1, comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      const errMsg = error.response?.data?.message;
      if (errMsg) toast.error(errMsg);
      else toast.error('Failed to add review');
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const discountedPrice = product?.discount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : null;

  if (isLoading) return <div className="flex justify-center items-center h-40"><Spinner /></div>;
  if (error) return <Typography color="red">{error}</Typography>;
  if (!product) return <Typography color="gray">Product not found.</Typography>;

  const { name, price, description, image, discount, averageRating } = product;

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Image & Actions */}
      <div className="sticky top-20 space-y-4">
        <div className="relative">
          <img src={image} alt={name} className="w-3/4 mx-auto rounded-xl shadow-md" />
          <button onClick={handleWishlistToggle} className="absolute top-3 right-3 text-2xl text-red-500 bg-white rounded-full p-2 shadow hover:scale-110 transition">
            {wishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className="flex space-x-4">
          <Button fullWidth className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2" onClick={handleAddToCart}>
            <FaShoppingCart /> Add to Cart
          </Button>
          <Button fullWidth className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2" onClick={handleBuyNow}>
            <FaBolt /> Buy Now
          </Button>
        </div>
      </div>

      {/* Right: Details & Reviews */}
      <div className="space-y-6">
        {/* Product Details */}
        <Card shadow={false}>
          <CardBody className="space-y-2">
            <Typography variant="h4" className="font-bold">{name}</Typography>
            <div className="flex items-center gap-2">
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                {averageRating < 4.1 ? 4.1 : averageRating} ★
              </span>
              <Typography variant="small" color="gray">10 Ratings</Typography>
            </div>
            {discountedPrice ? (
              <>
                <Typography variant="small" color="gray" className="line-through">₹{price}</Typography>
                <Typography className="text-indigo-600 text-xl font-bold">₹{discountedPrice}</Typography>
                <Typography className="text-green-600 text-sm font-medium">{discount}% OFF</Typography>
              </>
            ) : (
              <Typography className="text-indigo-600 text-xl font-bold">₹{price}</Typography>
            )}
            <Typography>{description}</Typography>
          </CardBody>
        </Card>

        {/* Reviews Accordion */}
        <Card>
          <CardBody>
            <Accordion open={reviewsOpen} icon={<></>}>
              <AccordionHeader onClick={() => setReviewsOpen(!reviewsOpen)}>
                Customer Reviews ({reviews.length})
              </AccordionHeader>
              <AccordionBody className="space-y-4">
                {reviews.length > 0 ? (
                  <div className="space-y-6 max-h-64 overflow-y-auto">
                    {reviews.slice(0, 10).map(review => (
                      <div key={review._id} className="flex gap-4 border-b pb-4">
                        <img src={dummyProfileImage} alt="User" className="w-10 h-10 rounded-full" />
                        <div>
                          <Typography variant="h6">{review.user.name}</Typography>
                          <Typography variant="small" color="gray">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                          <Typography className="text-amber-500">{'⭐'.repeat(review.rating)}</Typography>
                          <Typography>{review.comment}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography>No reviews yet.</Typography>
                )}

                {/* Toggle review form button */}
                {isLoggedIn && !showReviewForm && (
                  <Button size="sm" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setShowReviewForm(true)}>
                    Add Review
                  </Button>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mt-4 w-full">
                    <Card>
                      <CardBody className="flex flex-col gap-4">
                        <Typography variant="h6">Write a Review</Typography>
                        <div className="flex flex-col gap-2">
                          <Typography>Rating</Typography>
                          <Rating
                            value={newReview.rating}
                            onChange={value => setNewReview(prev => ({ ...prev, rating: value }))}
                          />
                        </div>
                        <Textarea
                          name="comment"
                          value={newReview.comment}
                          onChange={handleReviewChange}
                          className="w-full"
                          label="Comment"
                        />
                        <Button fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2" onClick={handleAddReview}>
                          Submit Review
                        </Button>
                      </CardBody>
                    </Card>
                  </div>
                )}

              </AccordionBody>
            </Accordion>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
