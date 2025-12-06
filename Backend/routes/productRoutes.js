const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const upload = require("../middleware/productUpload");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// CREATE PRODUCT (images + ALL category documents)
router.post(
  "/create",
  authenticateToken,
  authorizeRoles("vendor"),
  upload.any(), 
  ProductController.createProduct
);

// Get products
router.get(
  "/",
  authenticateToken,
  authorizeRoles("vendor", "admin", "vendor_manager"),
  ProductController.getAllProducts
);

// get product Documents
router.get(
  "/category/required_docs/:id",
  authenticateToken,
  authorizeRoles("vendor", "admin", "vendor_manager"),
  ProductController.getRequiredDocuments
);

// Get single product
router.get(
  "/:productId",
  authenticateToken,
  authorizeRoles("vendor", "admin", "vendor_manager"),
  ProductController.getProduct
);

// Update product approval
router.put(
  "/status/:productId",
  authenticateToken,
  authorizeRoles("vendor_manager", "admin"),
  ProductController.updateStatus
);

module.exports = router;
