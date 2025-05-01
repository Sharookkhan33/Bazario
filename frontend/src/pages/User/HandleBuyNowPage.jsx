import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || {};
  const [shippingAddress, setShippingAddress] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const userToken = localStorage.getItem('token');

  const [isLoading, setIsLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (userToken) {
          const res = await api.get('/users/profile', {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          setUser(res.data);
          setIsLoggedIn(true);
          setShippingAddress(res.data.shippingAddress || {});
        }
      } catch (error) {
        toast.error('Failed to fetch user data');
      } finally {
        setIsLoading(false);
        setAddressLoading(false);
      }
    }
    fetchData();
  }, [userToken]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuyNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (!isLoggedIn) {
      toast.error('Please log in to continue');
      navigate('/login');
      setIsProcessing(false);
      return;
    }

    const requiredFields = ["addressLine1", "city", "state", "postalCode", "country"];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        toast.error('Please complete your shipping address');
        setIsProcessing(false);
        return;
      }
    }

    const orderItems = cartItems.map((item) => {
      const discountedPrice = item.product?.discount
        ? Math.round(item.product.price - (item.product.price * item.product.discount) / 100)
        : item.product.price;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: discountedPrice,
      };
    });

    try {
      const orderRes = await api.post('/orders/place-order', {
        items: orderItems,
        shippingAddress,
      }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const { order } = orderRes.data;

      const checkoutSessionRes = await api.post('/payments/checkout-session', {
        orderId: order._id,
        customer_email: user.email,
      }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (checkoutSessionRes.data.url) {
        window.location.href = checkoutSessionRes.data.url;
      } else {
        toast.error('Stripe checkout failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Order failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-600 text-lg animate-pulse">Loading...</div>;

  // Calculate totals
  const billDetails = cartItems.map((item) => {
    const originalPrice = item.product.price;
    const discount = item.product.discount || 0;
    const discountedPrice = Math.round(originalPrice - (originalPrice * discount) / 100);
    const amountSaved = (originalPrice - discountedPrice) * item.quantity;
    const totalPrice = discountedPrice * item.quantity;

    return {
      ...item,
      originalPrice,
      discount,
      discountedPrice,
      amountSaved,
      totalPrice,
    };
  });

  const totalAmount = billDetails.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalSaved = billDetails.reduce((acc, item) => acc + item.amountSaved, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bill Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg space-y-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-4">Your Bill</h1>

          {billDetails.map((item) => (
            <div key={item.product._id} className="flex flex-col md:flex-row items-center md:items-start justify-between border-b pb-4 mb-6 gap-4">
              {/* Product Details */}
              <div className="flex items-center gap-4 w-full">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="flex flex-col text-right w-full md:w-auto text-sm space-y-1">
                <p className="text-gray-600">Price: ₹{item.originalPrice}</p>
                <p className="text-gray-600">Discount: {item.discount}%</p>
                <p className="text-green-600 font-semibold">Saved: ₹{item.amountSaved}</p>
                <p className="font-bold text-black">Final: ₹{item.totalPrice}</p>
              </div>
            </div>
          ))}

          {/* Total Section */}
          <div className="space-y-4">
            <div className="flex justify-between font-semibold text-green-600">
              <span>Total Saved:</span>
              <span>₹{totalSaved}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-4">Shipping Address</h2>

          {["addressLine1", "addressLine2", "city", "state", "postalCode", "country"].map((field) => (
            <div key={field} className="flex flex-col space-y-1">
              <label className="text-sm text-gray-600 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                name={field}
                value={shippingAddress?.[field] || ""}
                onChange={handleAddressChange}
                placeholder={`Enter ${field}`}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          ))}

          <button
            onClick={handleBuyNow}
            disabled={addressLoading || !shippingAddress?.addressLine1 || isProcessing}
            className="w-full py-3 rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-semibold disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Buy Now"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
