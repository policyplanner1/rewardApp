const db = require("../config/database");

class ProductModel {
  async createProduct(vendorId, data) {
    const safe = (v) => (v === undefined || v === "" ? null : v);

    const [result] = await db.execute(
      `INSERT INTO products 
       (vendor_id, category_id, brand_name, manufacturer, item_type, barcode, 
        product_name, description, short_description, size, color, model, dimension,
        stock, vendor_price, sale_price, tax_code, expiry_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        safe(vendorId),
        safe(data.category_id),
        safe(data.brandName),
        safe(data.manufacturer),
        safe(data.itemType),
        safe(data.barCode),
        safe(data.productName),
        safe(data.description),
        safe(data.shortDescription),
        safe(data.size),
        safe(data.color),
        safe(data.model),
        safe(data.dimension),
        safe(data.stock),
        safe(data.aa),
        safe(data.salesPrice),
        safe(data.taxCode),
        safe(data.expiryDate),
      ]
    );

    return result.insertId;
  }

  async insertProductImages(productId, files) {
    for (const file of files) {
      await db.execute(
        `INSERT INTO product_images (product_id, image_url)
         VALUES (?, ?)`,
        [productId, file.path]
      );
    }
  }

  async insertProductDocuments(productId, files, categoryId) {
    const [docTypes] = await db.execute(
      `SELECT document_type_id, document_key 
       FROM document_types
       WHERE level='product' AND category_id=?`,
      [categoryId]
    );

    if (!docTypes.length) return;

    for (const key of Object.keys(files)) {
      if (key === "images") continue;

      const file = files[key][0];

      const docInfo = docTypes.find((d) => d.document_key === key);
      if (!docInfo) continue;

      await db.execute(
        `DELETE FROM product_documents 
         WHERE product_id=? AND document_type_id=?`,
        [productId, docInfo.document_type_id]
      );

      await db.execute(
        `INSERT INTO product_documents
           (product_id, document_type_id, file_path, mime_type)
         VALUES (?, ?, ?, ?)`,
        [productId, docInfo.document_type_id, file.path, file.mimetype]
      );
    }
  }

  async getProductsByUserId(userId, userRole) {
    let query = `
      SELECT 
        p.*,
        c.category_name,
        (SELECT image_url FROM product_images WHERE product_id=p.product_id LIMIT 1) AS mainImage
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
    `;

    let params = [];

    if (userRole === "vendor") {
      const [[vendor]] = await db.execute(
        `SELECT vendor_id FROM vendors WHERE user_id=?`,
        [userId]
      );

      if (!vendor) return [];

      query += ` WHERE p.vendor_id=?`;
      params.push(vendor.vendor_id);
    }

    query += " ORDER BY p.created_at DESC";

    const [rows] = await db.execute(query, params);
    return rows;
  }

  async getProductById(productId) {
    const [[product]] = await db.execute(
      `SELECT p.*, v.company_name, c.category_name 
       FROM products p
       JOIN vendors v ON p.vendor_id = v.vendor_id
       JOIN categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [productId]
    );

    if (!product) return null;

    const [images] = await db.execute(
      `SELECT * FROM product_images WHERE product_id = ?`,
      [productId]
    );

    const [documents] = await db.execute(
      `SELECT pd.*, dt.document_name 
       FROM product_documents pd
       JOIN document_types dt ON pd.document_type_id = dt.document_type_id
       WHERE pd.product_id = ?`,
      [productId]
    );

    return { product, images, documents };
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
}

module.exports = new ProductModel();
