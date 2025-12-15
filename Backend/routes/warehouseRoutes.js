const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const wareHouseController = require("../controllers/wareHouseController");

// create new entry
router.post(
  "/stock-in",
  authenticateToken,
  authorizeRoles("warehouse_manager"),
  wareHouseController.stockIn
);

// get all the record data
router.get(
  "/stock-in",
  authenticateToken,
  authorizeRoles("warehouse_manager"),
  wareHouseController.getDetails
);

// send to Inventory
router.put(
  "/send-to-inventory",
  authenticateToken,
  authorizeRoles("warehouse_manager"),
  wareHouseController.sendToInventory
);

// get single stock detail
router.get(
  "/stock-in/:grn",
  authenticateToken,
  wareHouseController.getStockInByGrn
);


module.exports = router;
