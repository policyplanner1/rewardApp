// middleware/productUpload.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vendorId = req.user.vendor_id;
    const tempFolder = path.join(__dirname, "../uploads/temp", vendorId.toString());

    if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

    cb(null, tempFolder);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safe);
  },
});

const productUpload = multer({ storage: productStorage });

module.exports = { productUpload };
