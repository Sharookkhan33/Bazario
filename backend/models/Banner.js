const mongoose=require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String},
    subtitle: { type: String },
    image: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
