const db = require("../config/database");

const generateGRN = () => {
  const date = new Date();

  const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");

  const randomNum = Math.floor(10000 + Math.random() * 90000);

  return `GRN-${formattedDate}-${randomNum}`;
};

class wareHouseController {
  async stockIn(req, res) {
    try {
      const wareHouseManagerId = req.user.user_id;
      
      const {
        product_id,
        total_quantity,
        passed_quantity,
        failed_quantity,
        stock_in_date,
        location,
        expiry_date,
      } = req.body;

      if (!product_id || total_quantity <= 0) {
        return res.status(500).json({
          success: false,
          message: "Product and total quantity required",
        });
      }

      if (passed_quantity + failed_quantity !== total_quantity) {
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
            (grn, product_id, total_quantity, passed_quantity, failed_quantity, stock_in_date, location, expiry_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          grnNumber,
          product_id,
          total_quantity,
          passed_quantity,
          failed_quantity,
          stock_in_date,
          location,
          expiry_date || null,
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
}

module.exports = new wareHouseController();
