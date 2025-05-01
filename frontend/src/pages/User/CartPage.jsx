import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setCart({ items: [] });
      } else {
        console.error("Fetch cart error:", err);
        toast.error("Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const clearCart= async()=>{
    try {
      await api.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Cart cleared");
      setCart({ items: [] });
    }
    catch(error){
      toast.error("Failed to load cart");
    }
  }
  const handleClear = () => {
    toast.warn(
      <div >
        <Typography color="black" className="mb-2">
          Clear entire cart?
        </Typography>
        <div className="flex justify-end space-x-2">
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              clearCart();
              toast.dismiss();
            }}
          >
            Yes
          </Button>
          <Button
            size="sm"
            className="bg-gray-500 hover:bg-gray-600 text-white"
            onClick={() => toast.dismiss()}
          >
            No
          </Button>
        </div>
      </div>,
      { autoClose: false, hideProgressBar: true, closeOnClick: false }
    );
  };


  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Item removed");
      setCart((c) => ({
        ...c,
        items: c.items.filter((i) => i.product._id !== productId),
      }));
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove item");
    }
  };

  const adjustQty = async (productId, delta, currentQty) => {
    try {
      if (delta === -1 && currentQty === 1) {
        await handleRemove(productId);
      } else {
        await api.post(
          "/cart/add",
          { productId, quantity: delta },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setCart((c) => ({
          ...c,
          items: c.items.map((i) =>
            i.product._id === productId ? { ...i, quantity: i.quantity + delta } : i
          ),
        }));
      }
    } catch (err) {
      console.error("Adjust qty error:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems: cart.items } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  // Totals
  const originalTotal = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const discountedTotal = cart.items.reduce((sum, i) => {
    const dp = i.product.discount
      ? Math.round(i.product.price - (i.product.price * i.product.discount) / 100)
      : i.product.price;
    return sum + dp * i.quantity;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Typography variant="h4" className="font-bold">
        My Cart
      </Typography>
      <div className="flex justify-end space-x-4">
        <Button
          size="sm"
          className="bg-red-500 hover:bg-red-600"
          onClick={handleClear}
        >
          Clear Cart
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          disabled={!cart.items.length}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>

      {cart.items.length === 0 ? (
        <Typography color="gray" className="text-center py-10">
          Your cart is empty.
        </Typography>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => {
            const discount = item.product.discount;
            const discountedPrice = discount
              ? Math.round(item.product.price - (item.product.price * discount) / 100)
              : item.product.price;
            return (
              <Card
                key={item.product._id}
                className="flex flex-col sm:flex-row items-center sm:items-start bg-white p-3 rounded-md shadow hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/product/${item.product._id}`)}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                />
                <CardBody className="flex-1 px-3 sm:px-6">
                  <Typography variant="h6" className="truncate">
                    {item.product.name}
                  </Typography>
                  <div className="flex items-center space-x-2">
                    {discount ? (
                      <>
                        <Typography className="line-through text-gray-500 text-sm">
                          ₹{item.product.price.toFixed(2)}
                        </Typography>
                        <Typography className="text-indigo-600 text-base font-semibold">
                          ₹{discountedPrice.toFixed(2)}
                        </Typography>
                        <Typography className="text-green-600 text-xs font-medium">
                          {discount}% off
                        </Typography>
                      </>
                    ) : (
                      <Typography className="text-indigo-600 text-base font-semibold">
                        ₹{item.product.price.toFixed(2)}
                      </Typography>
                    )}
                  </div>
                </CardBody>

                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                  <IconButton
                    size="sm"
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustQty(item.product._id, -1, item.quantity);
                    }}
                  >
                    <FaMinus />
                  </IconButton>
                  <Typography className="w-6 text-center text-sm">
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustQty(item.product._id, 1, item.quantity);
                    }}
                  >
                    <FaPlus />
                  </IconButton>
                </div>

                <IconButton
                  size="sm"
                  variant="text"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.product._id);
                  }}
                >
                  <FaTrashAlt />
                </IconButton>
              </Card>
            );
          })}

          <div className="text-right">
            <Typography variant="h5" className="font-semibold">
              Total: ₹{discountedTotal.toFixed(2)}{' '}
              {originalTotal !== discountedTotal && (
                <span className="line-through text-gray-500 text-base ml-2">
                  ₹{originalTotal.toFixed(2)}
                </span>
              )}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
