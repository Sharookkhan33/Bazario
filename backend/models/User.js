const mongoose = require("mongoose");
const { hashPassword } = require("../utils/hash");

const AddressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Ensures emails are stored in lowercase
      match: [
        /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        "Please enter a valid email",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },

    shippingAddress: {
      type: AddressSchema,
      required: false, // ✅ Better than `default: null`
    },
    suspended: { type: Boolean, default: false },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
      },
    },
  },
  { timestamps: true }
);


// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongoose.model("User", userSchema);
