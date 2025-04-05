// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const multer = require("multer");
const path = require("path");

const connectDB =require('./config/db');

dotenv.config();
const app =express();


app.use(cors());
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB()

app.get("/",(req,res)=>{
    res.send("Bazario is running")
});

app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`)) 