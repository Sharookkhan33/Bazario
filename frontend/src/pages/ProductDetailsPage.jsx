import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const dummyProfileImage = "data:image/jpeg;base64,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";

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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const productResponse = await api.get(`/products/get/${id}`);
          const fetchedProduct = productResponse.data.product;
          setProduct(fetchedProduct);

          // Fetch related products by category
          if (fetchedProduct?.category) {
            const relatedResponse = await api.get(`/products?categories=${fetchedProduct.category}`);
            const allRelated = relatedResponse.data || [];
            const filteredRelated = allRelated.filter(p => p._id !== id);
            setRelatedProducts(filteredRelated);
          }
          
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
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

                  {isLoggedIn && !showReviewForm && (
                    <Button size="sm" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setShowReviewForm(true)}>
                      Add Review
                    </Button>
                  )}

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

{/* Related Products Section */}
<div className="mt-10">
  <Typography variant="h5" className="mb-4 font-bold">
    Related Products
  </Typography>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {relatedProducts.length === 0 ? (
      <Typography color="gray">No related products found.</Typography>
    ) : (
      relatedProducts.map((item) => (
        <Link to={`/product/${item._id}`} key={item._id} className="border rounded-lg p-4 hover:shadow-md transition">
          <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-2 rounded" />
          <Typography variant="h6" className="truncate">{item.name}</Typography>
          <Typography className="text-indigo-600 font-bold">₹{item.price}</Typography>
        </Link>
      ))
    )}
  </div>
</div>

    </div>
  );
};

export default ProductDetailsPage;
