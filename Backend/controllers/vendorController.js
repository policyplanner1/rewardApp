const VendorModel = require("../models/vendorModel");
const categoryModel = require("../models/categoryModel");

class VendorController {
  /* ============================================================
        ONBOARD VENDOR (Common Documents Only)
  ============================================================ */
  async onboardVendor(req, res) {
    try {
      const userId = req.user.user_id;
      const data = req.body;
      const files = req.files;

      const vendorId = await VendorModel.createVendor(data, userId);

      await VendorModel.insertAddress(vendorId, "business", data);
      await VendorModel.insertAddress(vendorId, "billing", data);
      await VendorModel.insertAddress(vendorId, "shipping", data);

      await VendorModel.insertBankDetails(vendorId, data);
      await VendorModel.insertContacts(vendorId, data);

      if (files) {
        await VendorModel.insertCommonDocuments(vendorId, files);
      }

      return res.status(201).json({
        success: true,
        message: "Vendor onboarded successfully",
        vendorId,
      });
    } catch (err) {
      console.error("ONBOARD ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Onboarding failed",
        error: err.message,
      });
    }
  }

  /* ============================================================
        GET A SPECIFIC VENDOR
  ============================================================ */
  async getVendor(req, res) {
    try {
      const vendorId = req.params.vendorId;

      const data = await VendorModel.getVendorById(vendorId);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.json({ success: true, data });
    } catch (err) {
      console.error("GET VENDOR ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /* ============================================================
        GET ALL VENDORS (Admin & Manager)
  ============================================================ */
  async getAllVendors(req, res) {
    try {
      const status = req.query.status || null;
      const vendors = await VendorModel.getAllVendors(status);

      return res.json({ success: true, data: vendors });
    } catch (err) {
      console.error("GET ALL VENDORS ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /* ============================================================
        UPDATE VENDOR STATUS (Admin / Vendor Manager)
  ============================================================ */
  async updateVendorStatus(req, res) {
    try {
      const { vendorId } = req.params;
      let { status, rejectionReason } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status field is required",
        });
      }

      status = status.toLowerCase().trim();

      const allowed = ["approved", "rejected", "pending"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }

      const updated = await VendorModel.updateVendorStatus(
        vendorId,
        status,
        rejectionReason || null
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.json({
        success: true,
        message: `Vendor status updated to ${status}`,
      });
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  // vendor manager creates category
  async createCategory(req, res) {
    try {
      const data = req.body;

      await categoryModel.createCategory(data);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
      });
    } catch (error) {
      console.error("category creation error:", error);
      res.status(500).json({
        success: false,
        message: "Category creation error",
        error: error.message,
      });
    }
  }

  // update category by vendor manager
  async updateCategory(req, res) {
    try {
      const categoryID = req.params.id;
      const data = req.body;

      const updatedCategory = await categoryModel.updateCategory(
        categoryID,
        data
      );

      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found or no changes made",
        });
      }

      res.status(200).json({
        success: true,
        data: updatedCategory,
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error("category updating error:", error);
      res.status(500).json({
        success: false,
        message: "Category updating error",
        error: error.message,
      });
    }
  }

  // vendor manager fetch all categories
  async getAllCategories(req, res) {
    try {
      const data = await categoryModel.getAllCategories();

      res.status(200).json({
        success: true,
        data,
        message: "Fetched all categories",
      });
    } catch (error) {
      console.error("fetching category error:", error);
      res.status(500).json({
        success: false,
        message: "error fetching categories",
        error: error.message,
      });
    }
  }

  // get category by ID
  async getCategoryById(req, res) {
    try {
      const categoryID = req.params.id;

      const data = await categoryModel.getCategoryById(categoryID);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        data,
        message: "Category fetched by ID",
      });
    } catch (error) {
      console.error("fetching category by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching category by ID",
        error: error.message,
      });
    }
  }

  // delete a category
  async deleteCategory(req, res) {
    try {
      const categoryID = req.params.id;

      const data = await categoryModel.deleteCategory(categoryID);

      res.status(200).json({
        success: true,
        data,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("delete category error:", error);
      res.status(500).json({
        success: false,
        message: "error deleting category",
        error: error.message,
      });
    }
  }
}

module.exports = new VendorController();
