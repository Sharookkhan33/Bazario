const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        match: [/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Invalid email"]
    },
    password: {
        type: String, 
        required: true, 
        minlength: 8
    },
    emailOTP: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
