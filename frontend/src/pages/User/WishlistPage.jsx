import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setWishlist({ products: [] });
      } else {
        console.error("Fetch wishlist error:", err);
        toast.error("Failed to load wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(
        "/wishlist/remove",
        {
          data: { productId },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Removed from wishlist");
      setWishlist(wl => ({
        ...wl,
        products: wl.products.filter(p => p._id !== productId)
      }));
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post(
        "/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-600">Loading wishlist…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>

      {wishlist.products.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {wishlist.products.map(product => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-white p-4 rounded shadow cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-fit sm:w-20 h-40 sm:h-20 object-cover rounded mb-2 sm:mb-0"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0 sm:flex-col sm:space-y-2 sm:space-x-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  + Cart
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product._id);
                  }}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
