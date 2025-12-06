const db = require("../config/database");

class ProductModel {
  async createProduct(vendorId, data) {
    const safe = (v) => (v === undefined || v === "" ? null : v);
    let custom_category = data.custom_category || null;
    let custom_subcategory = data.custom_subcategory || null;
    let custom_sub_subcategory = data.custom_sub_subcategory || null;

    const [result] = await db.execute(
      `INSERT INTO products 
     (vendor_id, category_id, subcategory_id, sub_subcategory_id, brand_name, manufacturer, item_type, barcode, 
      product_name, description, short_description, size, color, model, dimension,
      stock, vendor_price, sale_price, tax_code, expiry_date,
      custom_category, custom_subcategory, custom_sub_subcategory, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
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
        safe(data.size),
        safe(data.color),
        safe(data.model),
        safe(data.dimension),
        safe(data.stock),
        safe(data.aa),
        safe(data.salesPrice),
        safe(data.taxCode),
        safe(data.expiryDate),
        custom_category,
        custom_subcategory,
        custom_sub_subcategory,
      ]
    );

    return result.insertId;
  }

  async insertProductImages(productId, files) {
    for (const file of files) {
      // Only insert if the field is meant for images
      if (file.fieldname !== "images") continue;

      await db.execute(
        `INSERT INTO product_images (product_id, image_url)
       VALUES (?, ?)`,
        [productId, file.path]
      );
    }
  }

  async insertProductDocuments(productId, categoryId, files) {
    const [docTypes] = await db.execute(
      `SELECT d.document_id, d.document_key
     FROM category_documents cd
     JOIN documents d ON cd.document_id = d.document_id
     WHERE cd.category_id = ?`,
      [categoryId]
    );

    if (!docTypes.length) return;

    const requiredKeys = docTypes.map((d) => d.document_key);

    for (const file of files) {
      if (!requiredKeys.includes(file.fieldname)) continue;

      const docInfo = docTypes.find((d) => d.document_key === file.fieldname);

      await db.execute(
        `INSERT INTO product_documents
       (product_id, document_id, file_path, mime_type)
       VALUES (?, ?, ?, ?)`,
        [productId, docInfo.document_id, file.path, file.mimetype]
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
