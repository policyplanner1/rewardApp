const db = require("../config/database");

const generateGRN = () => {
  const date = new Date();

  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");

  const randomNum = Math.floor(10000 + Math.random() * 90000);

  return `GRN-${formattedDate}-${randomNum}`;
};

class wareHouseController {
  // new entry
  async stockIn(req, res) {
    try {
      const wareHouseManagerId = req.user.user_id;

      if (!wareHouseManagerId) {
        return res.status(400).json({
          success: false,
          message: "wareHouseManagerId is required",
        });
      }

      const {
        vendorId,
        productId,
        variantId,
        totalQuantity,
        passedQuantity,
        failedQuantity,
        stockInDate,
        location,
        expiryDate,
      } = req.body;

      if (!productId || totalQuantity <= 0) {
        return res.status(500).json({
          success: false,
          message: "Product and total quantity required",
        });
      }

      if (passedQuantity + failedQuantity !== totalQuantity) {
        return res.status(400).json({
          success: false,
          message: "Total quantity must equal passed + failed quantity",
        });
      }

      // Generate GRN (no DB lookup)
      const grnNumber = generateGRN();

      // Insert
      await db.query(
        `INSERT INTO stock_in_entries
            (grn,warehousemanager_id, product_id, vendor_id, variant_id, total_quantity, passed_quantity, failed_quantity, stock_in_date, location, expiry_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          grnNumber,
          wareHouseManagerId,
          productId,
          vendorId,
          variantId,
          totalQuantity,
          passedQuantity,
          failedQuantity,
          stockInDate,
          location,
          expiryDate || null,
        ]
      );

      res.json({
        success: true,
        message: "Stock-In entry created",
        grn: grnNumber,
      });
    } catch (err) {
      console.error("stock In Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // get all stock info
  async getDetails(req, res) {
    try {
      const status = req.query.status || "Pending";

      const [rows] = await db.query(
        `SELECT 
          s.id,
          s.warehousemanager_id,
          s.grn,
          s.total_quantity,
          s.passed_quantity,
          s.failed_quantity,
          s.stock_in_date,
          s.location,
          s.expiry_date,
          s.status,
          p.product_name AS productName,
          p.sku,
          COALESCE(c.category_name, p.custom_category) AS categoryName,
          v.full_name AS vendorName,
          u.name as WarehousemanagerName

          FROM stock_in_entries s
          JOIN products p ON s.product_id = p.product_id

          LEFT JOIN categories c ON p.category_id = c.category_id
          LEFT JOIN sub_categories sc ON p.subcategory_id = sc.subcategory_id
          LEFT JOIN sub_sub_categories ssc ON p.sub_subcategory_id = ssc.sub_subcategory_id

          JOIN vendors v ON p.vendor_id = v.vendor_id
          JOIN users u ON s.warehousemanager_id = u.user_id

          WHERE s.status = ? ;
        `,
        [status]
      );

      res.json({ success: true, data: rows });
    } catch (err) {
      console.error("Fetching stock record Error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new wareHouseController();
