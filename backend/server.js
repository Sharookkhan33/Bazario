// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes= require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartroutes = require("./routes/cartRoutes");
const reviewroutes = require("./routes/reviewRoutes");
const bannerroutes = require("./routes/bannerRoutes");
const categoryRoutes= require("./routes/categoryRoutes")
const multer = require("multer");

const connectDB =require('./config/db');

dotenv.config();
const app =express();


app.use(cors({
    origin: 'https://bazario-theta.vercel.app', // 👈 specify your frontend URL
    credentials: true,               // 👈 allow credentials (cookies, auth headers)
  }));
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));
app.use(bodyParser.json()); 
connectDB()

app.get("/",(req,res)=>{
    res.send("Bazario is running")
});

app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart",cartroutes);
app.use("/api/review",reviewroutes);
app.use("/api/banners",bannerroutes);
app.use("/api/categories",categoryRoutes)
app.use("/api/payments", require("./routes/paymentRoutes"));

const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`)) 