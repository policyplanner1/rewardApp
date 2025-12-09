const db = require("../config/database");

class ProductModel {
  // create a Product
  async createProduct(connection,vendorId, data) {
    const safe = (v) => (v === undefined || v === "" ? null : v);
    let custom_category = data.custom_category || null;
    let custom_subcategory = data.custom_subcategory || null;
    let custom_sub_subcategory = data.custom_sub_subcategory || null;

    const [result] = await connection.execute(
      `INSERT INTO products 
     (vendor_id, category_id, subcategory_id, sub_subcategory_id, brand_name, manufacturer, item_type, barcode, 
      product_name, description, short_description,tax_code, expiry_date,
      custom_category, custom_subcategory, custom_sub_subcategory, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        safe(vendorId),
        safe(data.category_id),
        safe(data.subcategory_id),
        safe(data.sub_subcategory_id),
        safe(data.brandName),
        safe(data.manufacturer),
        safe(data.itemType),
        safe(data.barCode),
        safe(data.productName),
        safe(data.description),
        safe(data.shortDescription),
        safe(data.taxCode),
        safe(data.expiryDate),
        custom_category,
        custom_subcategory,
        custom_sub_subcategory,
      ]
    );

    return result.insertId;
  }

  // insert product Images
  async insertProductImages(connection,productId, files) {
    for (const file of files) {
      // Only insert if the field is meant for images
      if (file.fieldname !== "images") continue;

      await connection.execute(
        `INSERT INTO product_images (product_id, image_url)
       VALUES (?, ?)`,
        [productId, file.path]
      );
    }
  }

  // store product Documents
  async insertProductDocuments(connection,productId, categoryId, files) {
    const [docTypes] = await connection.execute(
      `SELECT d.document_id
     FROM category_document cd
     JOIN documents d ON cd.document_id = d.document_id
     WHERE cd.category_id = ?`,
      [categoryId]
    );

    if (!docTypes.length) return;
    const validDocumentIds = docTypes.map((d) => d.document_id);

    for (const file of files) {
      const docId = parseInt(file.fieldname);
      if (!validDocumentIds.includes(docId)) continue;

      await db.execute(
        `INSERT INTO product_documents
       (product_id, document_id, file_path, mime_type)
       VALUES (?, ?, ?, ?)`,
        [productId, docId, file.path, file.mimetype]
      );
    }
  }

  // Insert product variant
  async createProductVariant(connection,productId, variant) {
    const safe = (v) => (v === undefined || v === "" ? null : v);

    const [result] = await connection.execute(
      `INSERT INTO product_variants
     (product_id, size, color, weight, custom_attributes, sku, mrp, vendor_price, sale_price, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        safe(variant.size),
        safe(variant.color),
        safe(variant.dimension),
        JSON.stringify(variant.customAttributes || {}),
        safe(variant.sku),
        safe(variant.MRP),
        safe(variant.vendorPrice || variant.salesPrice),
        safe(variant.salesPrice),
        safe(variant.stock),
      ]
    );

    return result.insertId;
  }

  // Insert variant images
  async insertProductVariantImages(connection,variantId, files) {
    for (const file of files) {
      await connection.execute(
        `INSERT INTO product_variant_images (variant_id, image_url)
       VALUES (?, ?)`,
        [variantId, file.path]
      );
    }
  }

  // Get required documents by category_id
  async getRequiredDocumentsByCategory(categoryId) {
    try {
      const [rows] = await db.execute(
        `SELECT d.document_id, d.document_name, d.status
       FROM documents d
       INNER JOIN category_document cd ON d.document_id = cd.document_id
       WHERE cd.category_id = ? AND d.status = 1`,
        [categoryId]
      );

      return rows;
    } catch (error) {
      console.error("Error fetching required documents:", error);
      throw error;
    }
  }

  // Get product by ID
  async getProductDetailsById(productId) {
    try {
      // 1️⃣ Get main product info
      const [productRows] = await db.execute(
        `SELECT * FROM products WHERE product_id = ?`,
        [productId]
      );

      if (!productRows.length) return null;
      const product = productRows[0];

      // 2️⃣ Get product images
      const [images] = await db.execute(
        `SELECT image_url FROM product_images WHERE product_id = ?`,
        [productId]
      );
      product.images = images.map((img) => img.image_url);

      // 3️⃣ Get product documents
      const [documents] = await db.execute(
        `SELECT pd.id, pd.file_path, pd.mime_type, d.document_name
       FROM product_documents pd
       JOIN documents d ON pd.document_id = d.document_id
       WHERE pd.product_id = ?`,
        [productId]
      );
      product.documents = documents;

      // 4️⃣ Get product variants
      const [variants] = await db.execute(
        `SELECT * FROM product_variants WHERE product_id = ?`,
        [productId]
      );

      // 5️⃣ Get images for each variant
      for (const variant of variants) {
        const [variantImages] = await db.execute(
          `SELECT image_url FROM product_variant_images WHERE variant_id = ?`,
          [variant.variant_id]
        );
        variant.images = variantImages.map((img) => img.image_url);
        variant.customAttributes = JSON.parse(
          variant.custom_attributes || "{}"
        );
      }
      product.variants = variants;

      return product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }

  // update product by Id
  async updateProduct(productId, data, files = []) {
    const safe = (v) => (v === undefined || v === "" ? null : v);
    const custom_category = data.custom_category || null;
    const custom_subcategory = data.custom_subcategory || null;
    const custom_sub_subcategory = data.custom_sub_subcategory || null;

    // 1️⃣ Update main product info
    await db.execute(
      `UPDATE products SET 
      category_id = ?, 
      subcategory_id = ?, 
      sub_subcategory_id = ?, 
      brand_name = ?, 
      manufacturer = ?, 
      item_type = ?, 
      barcode = ?, 
      product_name = ?, 
      description = ?, 
      short_description = ?, 
      tax_code = ?, 
      expiry_date = ?, 
      custom_category = ?, 
      custom_subcategory = ?, 
      custom_sub_subcategory = ? 
    WHERE product_id = ?`,
      [
        safe(data.category_id),
        safe(data.subcategory_id),
        safe(data.sub_subcategory_id),
        safe(data.brandName),
        safe(data.manufacturer),
        safe(data.itemType),
        safe(data.barCode),
        safe(data.productName),
        safe(data.description),
        safe(data.shortDescription),
        safe(data.taxCode),
        safe(data.expiryDate),
        custom_category,
        custom_subcategory,
        custom_sub_subcategory,
        productId,
      ]
    );

    // 2️⃣ Handle uploaded files
    if (files && files.length) {
      const mainImages = files.filter((f) => f.fieldname === "images");
      const otherFiles = files.filter((f) => f.fieldname !== "images");

      if (mainImages.length) {
        // Optional: Remove old images if needed
        await db.execute(`DELETE FROM product_images WHERE product_id = ?`, [
          productId,
        ]);
        await this.insertProductImages(productId, mainImages);
      }

      if (otherFiles.length) {
        // Optional: Remove old documents if needed
        await db.execute(`DELETE FROM product_documents WHERE product_id = ?`, [
          productId,
        ]);
        await this.insertProductDocuments(
          productId,
          data.category_id,
          otherFiles
        );
      }
    }

    // 3️⃣ Handle product variants
    if (data.variants) {
      let variants = JSON.parse(data.variants);
      if (!variants && !Array.isArray(variants)) return;

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        if (variant.variant_id) {
          // Existing variant -> update
          await db.execute(
            `UPDATE product_variants SET 
            size = ?, 
            color = ?, 
            weight = ?, 
            custom_attributes = ?, 
            sku = ?, 
            mrp = ?, 
            vendor_price = ?, 
            sale_price = ?, 
            stock = ? 
           WHERE variant_id = ?`,
            [
              safe(variant.size),
              safe(variant.color),
              safe(variant.dimension),
              JSON.stringify(variant.customAttributes || {}),
              safe(variant.sku),
              safe(variant.MRP),
              safe(variant.vendorPrice || variant.salesPrice),
              safe(variant.salesPrice),
              safe(variant.stock),
              variant.variant_id,
            ]
          );

          // Update variant images
          const variantFiles = files.filter((f) =>
            f.fieldname.startsWith(`variant_${i}_`)
          );
          if (variantFiles.length) {
            await db.execute(
              `DELETE FROM product_variant_images WHERE variant_id = ?`,
              [variant.variant_id]
            );
            await this.insertProductVariantImages(
              variant.variant_id,
              variantFiles
            );
          }
        } else {
          // New variant -> insert
          const newVariantId = await this.createProductVariant(
            productId,
            variant
          );
          const variantFiles = files.filter((f) =>
            f.fieldname.startsWith(`variant_${i}_`)
          );
          if (variantFiles.length) {
            await this.insertProductVariantImages(newVariantId, variantFiles);
          }
        }
      }
    }

    return true;
  }

  // delete product
  async deleteProduct(productId) {
    try {
      // Delete product variant images
      const [variants] = await db.execute(
        `SELECT variant_id FROM product_variants WHERE product_id = ?`,
        [productId]
      );
      for (const variant of variants) {
        await db.execute(
          `DELETE FROM product_variant_images WHERE variant_id = ?`,
          [variant.variant_id]
        );
      }

      // Delete product variants
      await db.execute(`DELETE FROM product_variants WHERE product_id = ?`, [
        productId,
      ]);

      // Delete product images
      await db.execute(`DELETE FROM product_images WHERE product_id = ?`, [
        productId,
      ]);

      // Delete product documents
      await db.execute(`DELETE FROM product_documents WHERE product_id = ?`, [
        productId,
      ]);

      // Delete main product
      await db.execute(`DELETE FROM products WHERE product_id = ?`, [
        productId,
      ]);

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // Get all products
  async getAllProductDetails() {
    try {
      const [rows] = await db.execute(
        `SELECT 
         product_id,
         vendor_id,
         category_id,
         subcategory_id,
         sub_subcategory_id,
         brand_name,
         manufacturer,
         item_type,
         barcode,
         product_name,
         description,
         short_description,
         tax_code,
         expiry_date,
         custom_category,
         custom_subcategory,
         custom_sub_subcategory,
         status,
         rejection_reason,
         created_at
       FROM products
       ORDER BY product_id DESC`
      );
      return rows;
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  // Get all products for a specific vendor
  async getProductsByVendor(vendorId) {
    try {
      const [rows] = await db.execute(
        `SELECT 
         product_id,
         vendor_id,
         category_id,
         subcategory_id,
         sub_subcategory_id,
         brand_name,
         manufacturer,
         item_type,
         barcode,
         product_name,
         description,
         short_description,
         tax_code,
         expiry_date,
         custom_category,
         custom_subcategory,
         custom_sub_subcategory,
         status,
         rejection_reason,
         created_at
       FROM products
       WHERE vendor_id = ?
       ORDER BY product_id DESC`,
        [vendorId]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching products by vendor:", error);
      throw error;
    }
  }

  async updateProductStatus(productId, status, reason) {
    const [result] = await db.execute(
      `UPDATE products 
       SET status=?, rejection_reason=?
       WHERE product_id=?`,
      [status, reason, productId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = new ProductModel();
