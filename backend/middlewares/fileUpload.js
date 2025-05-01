const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define allowed file types
const allowedImageTypes = /jpg|jpeg|png|gif/;

// Create folders dynamically if not exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Mapping types to folders
const typeToFolder = {
  profile: "marketplace/profiles/vendors",
  product: "marketplace/products",
  banner: "marketplace/banners",
  category: "marketplace/categories",
  invoice: "uploads/invoices",
};

const fileUpload = (type = "product") => {
  const folder = typeToFolder[type] || "uploads/others";

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "..", folder);
      ensureDirectoryExists(dir);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedImageTypes.test(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"));
      }
    },
  });

  return upload;
};

module.exports = fileUpload;
