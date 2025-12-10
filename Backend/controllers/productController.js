const ProductModel = require("../models/productModel");
const db = require("../config/database");

class ProductController {
  // create Product
  async createProduct(req, res) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const vendorId = req.user.vendor_id;
      const body = req.body;

      // Mandatory category
      if (!body.category_id && !body.custom_category) {
        return res.status(400).json({
          success: false,
          message: "Category ID is required",
        });
      }

      const productId = await ProductModel.createProduct(
        connection,
        vendorId,
        body
      );

      // Handle uploaded files
      if (req.files && req.files.length) {
        const mainImages = req.files.filter((f) => f.fieldname === "images");
        const otherFiles = req.files.filter((f) => f.fieldname !== "images");

        // Insert main product images
        if (mainImages.length) {
          await ProductModel.insertProductImages(
            connection,
            productId,
            mainImages
          );
        }

        // Insert product documents
        if (otherFiles.length) {
          await ProductModel.insertProductDocuments(
            connection,
            productId,
            body.category_id,
            otherFiles
          );
        }
      }
      //  Handle product variants
      if (body.variants) {
        let variants = JSON.parse(body.variants);

        if (!variants && !Array.isArray(variants)) return;

        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];

          // Insert variant in product_variants table
          const variantId = await ProductModel.createProductVariant(
            connection,
            productId,
            variant
          );

          // uploaded files for this variant (fieldname convention: variant_0_image, variant_1_image, etc.)
          const variantFiles = req.files.filter((f) =>
            f.fieldname.startsWith(`variant_${i}_`)
          );

          // Insert variant images
          if (variantFiles.length) {
            await ProductModel.insertProductVariantImages(
              connection,
              variantId,
              variantFiles
            );
          }
        }
      }

      await connection.commit();

      return res.json({
        success: true,
        productId,
      });
    } catch (err) {
      if (connection) await connection.rollback();

      console.log("PRODUCT CREATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    } finally {
      if (connection) connection.release();
    }
  }

  // Get product by ID
  async getProductDetailsById(req, res) {
    try {
      const productId = req.params.id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      const product = await ProductModel.getProductDetailsById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("GET PRODUCT BY ID ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update Product
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const body = req.body;
      const files = req.files;

      if (!productId) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      await ProductModel.updateProduct(productId, body, files);

      return res.json({
        success: true,
        message: "Product updated successfully",
      });
    } catch (err) {
      console.error("PRODUCT UPDATE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // Delete Product
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;

      if (!productId) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID is required" });
      }

      await ProductModel.deleteProduct(productId);

      return res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      console.error("PRODUCT DELETE ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // Get all Products
  async getAllProductDetails(req, res) {
    try {
      const products = await ProductModel.getAllProductDetails();
      return res.json({
        success: true,
        products,
      });
    } catch (err) {
      console.error("GET ALL PRODUCTS ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // Get all products by vendor
  async getProductsByVendor(req, res) {
    try {
      const vendorId = req.params.vendorId;
      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const products = await ProductModel.getProductsByVendor(vendorId);

      return res.json({
        success: true,
        products,
      });
    } catch (err) {
      console.error("GET PRODUCTS BY VENDOR ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // My Listed Products
  async getMyListedProducts(req, res) {
    try {
      const vendorId = req.user.vendor_id;
      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const products = await ProductModel.getProductsByVendor(vendorId);

      const stats = products.reduce(
        (acc, product) => {
          // Count total products
          acc.total += 1;

          // Count products by their status
          if (product.status === "pending") acc.pending += 1;
          if (product.status === "approved") acc.approved += 1;
          if (product.status === "rejected") acc.rejected += 1;
          if (product.status === "resubmission") acc.resubmission += 1;

          return acc;
        },
        {
          pending: 0,
          approved: 0,
          rejected: 0,
          resubmission: 0,
          total: 0,
        }
      );

      return res.json({
        success: true,
        products,
        stats
      });
    } catch (err) {
      console.error("Get my product list Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // Get categories documents based on Id
  async getRequiredDocuments(req, res) {
    try {
      const categoryID = req.params.id;
      const documents = await ProductModel.getRequiredDocumentsByCategory(
        categoryID
      );

      return res.json({ success: true, data: documents });
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
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      const updated = await ProductModel.updateProductStatus(
        productId,
        status,
        rejectionReason || null
      );

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      return res.json({
        success: true,
        message: `Product ${status}`,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

module.exports = new ProductController();
