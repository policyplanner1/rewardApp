const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const wareHouseController = require("../controllers/wareHouseController");

// create new entry
router.post("/stock-in",authenticateToken,authorizeRoles('warehouse_manager'),wareHouseController.stockIn);

module.exports = router;
