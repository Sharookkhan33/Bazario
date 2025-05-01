const Banner= require( "../models/Banner.js");
const { uploadToCloudinary }= require( "../utils/cloudinaryUpload.js");
const path= require("path"); 

exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, link, isActive } = req.body;
    let imageUrl = req.body.image;

    // If file is uploaded
    if (req.file) {
      const cloudinaryUrl = await uploadToCloudinary(req.file.path, "marketplace/banners");
      imageUrl = cloudinaryUrl;
    }

    if (!imageUrl) {
      return res.status(400).json({ error: "Image or image file is required" });
    }

    const banner = new Banner({
      title,
      subtitle,
      link,
      isActive: isActive !== undefined ? isActive : true,
      image: imageUrl,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBanners = async (req, res) => {
  const banners = await Banner.find({ isActive: true });
  res.json(banners);
};

exports.getAdminBanners = async (req, res) => {
const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
};

exports.updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const existingBanner = await Banner.findById(bannerId);
    if (!existingBanner) return res.status(404).json({ error: "Banner not found" });

    let imageUrl = req.body.image;

    // If file is uploaded
    if (req.file) {
      const localFilePath = path.join(req.file.destination, req.file.filename);
      imageUrl = await uploadToCloudinary(localFilePath, "marketplace/banners");
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      {
        title: req.body.title || existingBanner.title,
        subtitle: req.body.subtitle || existingBanner.subtitle,
        image: imageUrl || existingBanner.image,
        link: req.body.link || existingBanner.link,
        isActive: req.body.isActive !== undefined ? req.body.isActive : existingBanner.isActive,
      },
      { new: true }
    );

    res.json(updatedBanner);
  } catch (err) {
    console.error("Update Banner Error:", err);
    res.status(500).json({ error: "Failed to update banner" });
  }
}; 
exports.deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Banner deleted" });
};


exports.updateBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.status(200).json({ message: "Status updated", banner });
  } catch (err) {
    console.error("Status update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
