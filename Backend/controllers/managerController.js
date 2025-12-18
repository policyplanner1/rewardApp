const ManagerModel = require("../models/managerModel");
const db = require("../config/database");

class ManagerController {
  // ========== BASIC STATS FOR CARDS ==========
  async getDashboardStats(req, res) {
    try {
      const data = await ManagerModel.fetchStats();
      res.json({ success: true, data });
    } catch (err) {
      console.error("STATS ERROR:", err);
      res.status(500).json({ success: false, message: "Failed to load stats" });
    }
  }

  // ========== CHARTS DATA ==========
  async getDashboardCharts(req, res) {
    try {
      const data = await ManagerModel.fetchCharts();
      res.json({ success: true, data });
    } catch (err) {
      console.error("CHARTS ERROR:", err);
      res
        .status(500)
        .json({ success: false, message: "Failed to load chart data" });
    }
  }

  // all Vendor List
  async vendorList(req, res) {
    const role = req.user?.role;

    console.log(role, "role");
    try {
      if (role != "vendor_manager" && role != "admin") {
        return res
          .status(400)
          .json({ success: false, message: "Unauthorized user" });
      }

      const [vendorRows] = await db.query(`
        SELECT 
            v.*,
            u.email,
            u.phone,
            u.name,
            u.role
        FROM vendors v
        JOIN users u ON v.user_id = u.user_id
      `);

      if (vendorRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.json({
        data: vendorRows,
        success: true,
        message: "Product approved successfully",
      });
    } catch (error) {
      console.error("Error fetching vendor List:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch Vendor Details" });
    }
  }

  // Approve vendor Product
  async approveProduct(req, res) {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      const [productRows] = await db.query(
        `SELECT * FROM products WHERE product_id = ?`,
        [productId]
      );

      if (productRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const product = productRows[0];

      if (productRows.length > 0) {
        await db.query(
          `UPDATE products
         SET status = 'approved',rejection_reason=''
         WHERE product_id = ?`,
          [product.product_id]
        );
      }

      return res.json({
        success: true,
        message: "Product approved successfully",
      });
    } catch (error) {
      console.error("Approve product error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to approve products" });
    }
  }

  // reject vendor Product
  async rejectProduct(req, res) {
    try {
      const { productId } = req.params;
      const { reason } = req.body;

      if (!productId) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      const [productRows] = await db.query(
        `SELECT * FROM products WHERE product_id = ?`,
        [productId]
      );

      if (productRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const product = productRows[0];

      if (productRows.length > 0) {
        await db.query(
          `UPDATE products
         SET status = 'rejected',rejection_reason = ?
         WHERE product_id = ?`,
          [reason, product.product_id]
        );
      }

      return res.json({
        success: true,
        message: "Product rejected successfully",
      });
    } catch (error) {
      console.error("Reject product error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to reject product" });
    }
  }

  // Resubmission needed for vendor Product
  async resubmissionRequest(req, res) {
    try {
      const { productId } = req.params;
      const { reason } = req.body;

      if (!productId) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      const [productRows] = await db.query(
        `SELECT * FROM products WHERE product_id = ?`,
        [productId]
      );

      if (productRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const product = productRows[0];

      if (productRows.length > 0) {
        await db.query(
          `UPDATE products
         SET status = 'resubmission',rejection_reason = ?
         WHERE product_id = ?`,
          [reason, product.product_id]
        );
      }

      return res.json({
        success: true,
        message: "Resubmission requested successfully",
      });
    } catch (error) {
      console.error("Product Resubmission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send resubmission reject",
      });
    }
  }
}

module.exports = new ManagerController();
