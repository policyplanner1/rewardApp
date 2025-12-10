const multer = require("multer");
const fs = require("fs");
const path = require("path");

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vendorId = req.user.vendor_id;

    const folder = path.join(__dirname, "../uploads/products", vendorId.toString());

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safe);
  },
});

// Helper to get relative path for DB
function getRelativeFilePath(file) {
  const vendorId = file.path.split("products")[1].split(path.sep)[1];
  return `products/${vendorId}/${file.filename}`;
}

const productUpload = multer({ storage: productStorage });

module.exports = { productUpload, getRelativeFilePath };
