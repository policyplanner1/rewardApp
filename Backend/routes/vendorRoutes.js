const express = require("express");
const VendorController = require("../controllers/vendorController");
const DocumentController = require("../controllers/documentController");
const upload = require("../middleware/upload");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/onboard",
  authenticateToken,
  authorizeRoles("vendor"),
  upload.fields([
    { name: "gstinFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "bankProofFile", maxCount: 1 },
    { name: "signatoryIdFile", maxCount: 1 },
    { name: "businessProfileFile", maxCount: 1 },
    { name: "vendorAgreementFile", maxCount: 1 },
    { name: "brandLogoFile", maxCount: 1 },
    { name: "authorizationLetterFile", maxCount: 1 },
    { name: "addressProofElectricityBillFile", maxCount: 1 }
  ]),
  VendorController.onboardVendor
);

// Get vendor by ID
router.get(
  "/:vendorId",
  authenticateToken,
  authorizeRoles("admin", "vendor", "vendor_manager"),
  VendorController.getVendor
);

// Get all vendors
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "vendor_manager"),
  VendorController.getAllVendors
);

// Update vendor status
router.put(
  "/status/:vendorId",
  authenticateToken,
  authorizeRoles("admin", "vendor_manager"),
  VendorController.updateVendorStatus
);

// Update document verification
router.put(
  "/documents/:documentId/status",
  authenticateToken,
  authorizeRoles("admin", "vendor_manager"),
  DocumentController.updateDocumentStatus
);

// vendor Manager category Routes
  // 1)create Category
  router.post('/create-category',authenticateToken,authorizeRoles("vendor_manager"),VendorController.createCategory)

  // 2)All categories
  router.get('/category',authenticateToken,authorizeRoles("vendor_manager"),VendorController.getAllCategories)

  // 3)get category by ID
  router.get('/category/:id',authenticateToken,authorizeRoles("vendor_manager"),VendorController.getCategoryById)

  // 4)update category
  router.put('/update-category/:id',authenticateToken,authorizeRoles("vendor_manager"),VendorController.updateCategory)

  // 5)delete a category
  router.delete('/delete-category/:id',authenticateToken,authorizeRoles("vendor_manager"),VendorController.deleteCategory)


// vendor Manager subCategory Routes



// vendor Manager sub_sub_category Routes


module.exports = router;