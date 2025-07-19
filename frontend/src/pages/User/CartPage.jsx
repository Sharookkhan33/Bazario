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
  const [updatingIds, setUpdatingIds] = useState(new Set()); // track items being updated
  const navigate = useNavigate();

  /* ---------------------- FETCH CART ---------------------- */
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

  /* ---------------------- CLEAR CART ---------------------- */
  const clearCart = async () => {
    try {
      await api.delete("/cart/clear", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Cart cleared");
      setCart({ items: [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear cart");
    }
  };

  const handleClear = () => {
    toast.warn(
      <div>
        <Typography color="black" className="mb-2 font-medium">
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

  /* ---------------------- REMOVE ITEM ---------------------- */
  const handleRemove = async (productId) => {
    // optimistic removal
    const prev = cart.items;
    setCart((c) => ({
      ...c,
      items: c.items.filter((i) => i.product._id !== productId),
    }));
    try {
      await api.delete(`/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Item removed");
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove item");
      // rollback
      setCart((c) => ({ ...c, items: prev }));
    }
  };

  /* ---------------------- ADJUST QUANTITY ---------------------- */
  const adjustQty = async (productId, delta) => {
    // Prevent parallel updates for same product
    if (updatingIds.has(productId)) return;

    const item = cart.items.find((i) => i.product._id === productId);
    if (!item) return;

    const currentQty = item.quantity;
    if (delta < 0 && currentQty === 1) {
      // Option A: prevent removal; just disable minus at 1 (we do that in UI)
      return;
      // Option B (if you want minus at 1 to remove):
      // return handleRemove(productId);
    }

    // If you have stock limits later:
    // const maxStock = item.product.stock ?? Infinity;
    // if (delta > 0 && currentQty >= maxStock) {
    //   toast.info("No more stock available");
    //   return;
    // }

    // Optimistic update
    setUpdatingIds((s) => new Set(s).add(productId));
    setCart((c) => ({
      ...c,
      items: c.items.map((i) =>
        i.product._id === productId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      ),
    }));

    try {
      await api.post(
        "/cart/add",
        { productId, quantity: delta },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // If you prefer server-authoritative state each time:
      // await fetchCart();
    } catch (err) {
      console.error("Adjust qty error:", err);
      toast.error("Failed to update quantity");
      // rollback
      setCart((c) => ({
        ...c,
        items: c.items.map((i) =>
          i.product._id === productId
            ? { ...i, quantity: currentQty }
            : i
        ),
      }));
    } finally {
      setUpdatingIds((s) => {
        const n = new Set(s);
        n.delete(productId);
        return n;
      });
    }
  };

  /* ---------------------- CHECKOUT ---------------------- */
  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems: cart.items } });
  };

  /* ---------------------- LOADING STATE ---------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  /* ---------------------- TOTALS ---------------------- */
  const originalTotal = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const discountedTotal = cart.items.reduce((sum, i) => {
    const dp = i.product.discount
      ? Math.round(
          i.product.price - (i.product.price * i.product.discount) / 100
        )
      : i.product.price;
    return sum + dp * i.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Typography variant="h4" className="font-bold">
          My Cart
        </Typography>
        <div className="flex flex-wrap justify-start sm:justify-end gap-3">
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600"
            onClick={handleClear}
            disabled={!cart.items.length}
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
      </div>

      {cart.items.length === 0 ? (
        <Typography color="gray" className="text-center py-14">
          Your cart is empty.
        </Typography>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => {
            const discount = item.product.discount;
            const discountedPrice = discount
              ? Math.round(
                  item.product.price -
                    (item.product.price * discount) / 100
                )
              : item.product.price;

            const isUpdating = updatingIds.has(item.product._id);

            return (
              <Card
                key={item.product._id}
                className="bg-white rounded-md shadow hover:shadow-lg transition relative"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr_auto] gap-4 sm:gap-6 p-4 items-center">
                  {/* Image */}
                  <div
                    className="w-24 h-24 sm:w-20 sm:h-20 rounded overflow-hidden bg-gray-100 cursor-pointer mx-auto sm:mx-0 flex items-center justify-center"
                    onClick={() =>
                      navigate(`/product/${item.product._id}`)
                    }
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <CardBody className="p-0 w-full">
                    <Typography
                      variant="h6"
                      className="font-medium text-gray-900 mb-1 leading-tight line-clamp-2"
                    >
                      {item.product.name}
                    </Typography>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      {discount ? (
                        <>
                          <span className="line-through text-gray-400">
                            ₹{item.product.price.toFixed(2)}
                          </span>
                          <span className="text-indigo-600 font-semibold">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-medium">
                            {discount}% off
                          </span>
                        </>
                      ) : (
                        <span className="text-indigo-600 font-semibold">
                          ₹{item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardBody>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                    {/* Quantity segmented control */}
                    <div
                      className={`flex items-stretch rounded-md border border-gray-300 overflow-hidden select-none ${
                        isUpdating ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      <button
                        aria-label="Decrease quantity"
                        className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200 transition text-gray-700 disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          adjustQty(item.product._id, -1)
                        }
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <div className="w-12 flex items-center justify-center font-medium text-gray-900">
                        {item.quantity}
                      </div>
                      <button
                        aria-label="Increase quantity"
                        className="px-3 py-2 hover:bg-gray-100 active:bg-gray-200 transition text-gray-700"
                        onClick={() =>
                          adjustQty(item.product._id, 1)
                        }
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
                      aria-label="Remove item"
                      disabled={isUpdating}
                    >
                      <FaTrashAlt className="text-base" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {isUpdating && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center pointer-events-none">
                    <Spinner className="h-6 w-6" />
                  </div>
                )}
              </Card>
            );
          })}

          {/* Totals */}
          <div className="text-right pt-4 border-t">
            <Typography variant="h5" className="font-semibold">
              Total: ₹{discountedTotal.toFixed(2)}{" "}
              {originalTotal !== discountedTotal && (
                <span className="line-through text-gray-500 text-base ml-2">
                  ₹{originalTotal.toFixed(2)}
                </span>
              )}
            </Typography>
            {originalTotal !== discountedTotal && (
              <Typography
                variant="small"
                className="text-green-600 font-medium mt-1"
              >
                You saved ₹{(originalTotal - discountedTotal).toFixed(2)}!
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
