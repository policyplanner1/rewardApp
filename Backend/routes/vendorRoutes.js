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

module.exports = router;