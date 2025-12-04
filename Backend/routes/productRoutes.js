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
  upload.fields([
    { name: "images", maxCount: 10 },

    // Food
    { name: "fssai", maxCount: 1 },
    { name: "ingredients", maxCount: 1 },
    { name: "nutrition", maxCount: 1 },
    { name: "shelf_life", maxCount: 1 },
    { name: "food_lab_report", maxCount: 1 },
    { name: "label_compliance", maxCount: 1 },

    // Electronics
    { name: "bis", maxCount: 1 },
    { name: "wpc", maxCount: 1 },
    { name: "import_license", maxCount: 1 },
    { name: "dealer_cert", maxCount: 1 },
    { name: "warranty_terms", maxCount: 1 },
    { name: "energy_label", maxCount: 1 },

    // Clothing
    { name: "fabric_composition", maxCount: 1 },
    { name: "size_chart", maxCount: 1 },
    { name: "wash_care_label", maxCount: 1 },

    // Others
    { name: "material_declaration", maxCount: 1 },
    { name: "factory_license", maxCount: 1 },
    { name: "heat_resistance", maxCount: 1 },
    { name: "usage_manual", maxCount: 1 },
    { name: "safety_cert", maxCount: 1 },
    { name: "weight_accuracy", maxCount: 1 },
    { name: "liquor_license", maxCount: 1 },
    { name: "fire_noc", maxCount: 1 },
    { name: "trade_license", maxCount: 1 },
  ]),
  ProductController.createProduct
);

// Get products
router.get(
  "/",
  authenticateToken,
  authorizeRoles("vendor", "admin", "vendor_manager"),
  ProductController.getAllProducts
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
