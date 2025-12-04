const ProductModel = require("../models/productModel");

class ProductController {

  async createProduct(req, res) {
    try {
      const vendorId = req.user.vendor_id;
      const body = req.body;

      // Category mandatory
      if (!body.category_id) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required"
        });
      }

      const productId = await ProductModel.createProduct(vendorId, body);

      if (req.files) {
        await ProductModel.insertProductImages(productId, req.files.images || []);
        await ProductModel.insertProductDocuments(productId, req.files, body.category_id);
      }

      return res.json({
        success: true,
        productId
      });

    } catch (err) {
      console.log("PRODUCT CREATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  // Get products based on role
  async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getProductsByUserId(
        req.user.user_id,
        req.user.role
      );

      return res.json({ success: true, data: products });

    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get single product
  async getProduct(req, res) {
    try {
      const productId = req.params.productId;
      const product = await ProductModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      return res.json({ success: true, data: product });

    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Update product status
  async updateStatus(req, res) {
    try {
      const { productId } = req.params;
      const { status, rejectionReason } = req.body;

      const allowed = ["approved", "rejected", "pending"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const updated = await ProductModel.updateProductStatus(
        productId,
        status,
        rejectionReason || null
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.json({
        success: true,
        message: `Product ${status}`
      });

    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new ProductController();
