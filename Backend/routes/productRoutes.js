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

// Get product by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("vendor", "vendor_manager"),
  ProductController.getProductDetailsById
);





// get product Documents
router.get(
  "/category/required_docs/:id",
  authenticateToken,
  authorizeRoles("vendor", "admin", "vendor_manager"),
  ProductController.getRequiredDocuments
);

// Update product approval
router.put(
  "/status/:productId",
  authenticateToken,
  authorizeRoles("vendor_manager", "admin"),
  ProductController.updateStatus
);

// Update product
router.put(
  "/update-product/:id",
  authenticateToken,
  authorizeRoles("vendor"),
  upload.any(),
  ProductController.updateProduct
);

// Delete product
router.delete(
  "/delete-product/:id",
  authenticateToken,
  authorizeRoles("vendor"),
  ProductController.deleteProduct
);

// Get all products
router.get(
  "/all-products",
  authenticateToken,
  authorizeRoles("vendor"),
  ProductController.getAllProductDetails
);

// Get products by vendor
router.get(
  "/vendor-products/:vendorId",
  authenticateToken,
  authorizeRoles("vendor", "vendor_manager"), 
  ProductController.getProductsByVendor
);

module.exports = router;
