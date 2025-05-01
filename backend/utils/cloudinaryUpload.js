// utils/cloudinaryUpload.js
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadToCloudinary = async (localFilePath, folder = "uploads", resourceType = "auto") => {
  if (!localFilePath) return null;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: resourceType,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // safely remove local file
    }

    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // safely remove even if upload fails
    }
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId); // Delete the file from Cloudinary
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
