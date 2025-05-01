import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";
import { Spinner } from "@material-tailwind/react";
import moment from "moment";

export default function PaymentsSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/payments/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-6">
      <Typography variant="h4" className="mb-6 text-blue-800">
        My Payments
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner color="blue" />
        </div>
      ) : payments.length === 0 ? (
        <Typography color="gray">No payments yet.</Typography>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {payments.map((p) => (
            <Card key={p._id} className="shadow-lg">
              <CardBody className="space-y-3">
                <div className="flex justify-between items-center">
                  <Typography variant="h6">Payment ID</Typography>
                  <Chip
                    size="sm"
                    value={p.status.toUpperCase()}
                    color={p.status === "paid" ? "green" : "red"}
                  />
                </div>

                <div className="space-y-1 text-sm">
                  <Typography>
                    <strong>Amount:</strong> ₹{p.amount.toFixed(2)}
                  </Typography>
                  {p.discountApplied > 0 && (
                    <Typography>
                      <strong>Discount:</strong> ₹{p.discountApplied.toFixed(2)}
                    </Typography>
                  )}
                  <Typography>
                    <strong>Order ID:</strong> {p.orderId}
                  </Typography>
                  <Typography>
                    <strong>Session ID:</strong>{" "}
                    <span className="break-words">{p.sessionId}</span>
                  </Typography>
                  <Typography>
                    <strong>Date:</strong>{" "}
                    {moment(p.createdAt).format("MMMM D, YYYY, h:mm A")}
                  </Typography>
                </div>

                {p.invoiceUrl && (
                  <Button
                    size="sm"
                    fullWidth
                    color="blue"
                    className="mt-2"
                    onClick={() => window.open(p.invoiceUrl, "_blank")}
                  >
                    Download Invoice
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
