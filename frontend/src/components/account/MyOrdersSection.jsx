import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button, Chip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const statusColors = {
  pending: "amber",
  processing: "blue",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/user-orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => setOrders(res.data));
  }, []);



  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddReview = (productId) => {
    navigate(`/product/${productId}#add-review`);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 px-4">
      <Typography variant="h4" className="text-center font-semibold">
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography color="gray" className="text-center">
          No orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} shadow={true}>
            <CardBody className="space-y-4">
              <div className="flex justify-between items-center">
                <Typography variant="h6">Order ID: {order._id}</Typography>
                <Chip
                  value={order.status}
                  color={statusColors[order.status]}
                  variant="filled"
                  size="sm"
                  className="capitalize"
                />
              </div>

              {order.items.map((item) => (

                <div
                  key={item._id}
                  className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => handleViewProduct(item.product._id)}
                  >
                    <img
                      src={item.product?.image || "https://via.placeholder.com/50"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <Typography className="font-semibold">{item.product?.name}</Typography>
                      <Typography variant="small" color="gray">
                        Quantity: {item.quantity} | ₹{item.price} each
                      </Typography>
                    </div>
                  </div>

                  {order.status === "delivered" && (
                    <Button
                      size="sm"
                      className="bg-blue-500 text-white"
                      onClick={() => handleAddReview(item.product._id)}
                    >
                      Add Review
                    </Button>
                  )}
                </div>
              ))}

              <div className="text-right text-gray-700 font-medium">
                Total: ₹{order.totalAmount}
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderList;
