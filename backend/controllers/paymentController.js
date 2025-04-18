const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const generateInvoice = require("../utils/invoiceGenerator");
const {sendInvoiceEmail} = require("../services/emailService");
const path = require("path");



exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderId, customer_email } = req.body;

    // Fetch order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Convert order items to Stripe format
    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Convert to paise
      },
      quantity: item.quantity,
    }));

    // ✅ Create Checkout Session with name & address collection
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email,
      billing_address_collection: "required", // ✅ Force Stripe to collect billing details
      shipping_address_collection: { // ✅ Collect shipping address if needed
        allowed_countries: ["IN"],
      },
      metadata: { orderId: order._id.toString() }, // Store orderId
      success_url: `${process.env.DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/payment-failed`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Function to confirm payment and update order status
exports.confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    // Fetch session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Fetch order
    const orderId = session.metadata.orderId;
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.status = "processing";
    order.paymentStatus = "paid";
    await order.save();

    // Save payment
    const payment = await Payment.create({
      userId: order.user._id,
      sessionId: session.id,
      orderId: order._id,
      amount: session.amount_total / 100,
      currency: session.currency,
      status: session.payment_status,
      paymentIntent: session.payment_intent,
    });

    // ✅ Generate invoice PDF
    const filepath = path.join(__dirname, "../invoices", `Invoice-${order._id}.pdf`);
    await generateInvoice(order, payment, filepath);

    // ✅ Send invoice via email
    const email = req.user.email;
    if (email) {
      await sendInvoiceEmail({
        to: email,
        subject: "Your Payment Receipt",
        text: "Thank you for your purchase! Attached is your payment receipt.",
        attachments: [
          {
            filename: `Invoice-${order._id}.pdf`,
            path: filepath,
          },
        ],
      });
    }

    res.status(200).json({
      message: "Payment confirmed, order updated, invoice sent",
      orderStatus: order.status,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ error: error.message });
  }
};
