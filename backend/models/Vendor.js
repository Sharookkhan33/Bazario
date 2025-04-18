const mongoose = require("mongoose");
const {hashPassword} = require ("../utils/hash");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
        email: {
            type: String, required: [true, "Email is required"], unique: true, lowercase: true, match: [
                /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                "Please enter a valid email",
            ]
        },
    phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
        },
        password: {
          type: String,
          required: [true, "Password is required"],
          validate: {
            validator: function (value) {
              // ✅ Only run this validation when the password is new or being updated
              if (!this.isModified("password")) return true;
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message:
              "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
          },
        },
        
        emailOTP: { type: String, required: false },
    emailVerified: { type: Boolean, default: false },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    isActive: { type: Boolean, default: true },
    businessName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    gstNumber: { type: String, unique: true }, 
    profilePhoto: { type: String },
    stripeAccountId: { type: String },


    documents: [
      {
        name: { type: String },
        filePath: { type: String },
      },
    ],
    bankDetails: {
      accountHolderName: { type: String, required: true },
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
    },

    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionMessage: {type:String},
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);
  VendorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await hashPassword(this.password);
    next();
  }
);

module.exports = mongoose.model("Vendor", VendorSchema);
