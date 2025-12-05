
const db = require("../config/database");

class SubCategoryController {

  // Get all categories
  async getAllSubCategories(req, res) {
    try {
      const [rows] = await db.execute(`SELECT * FROM sub_categories LEFT JOIN categories on sub_categories.category_id=categories.category_id`);

      res.json({
        success: true,
        data: rows
      });

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getSubCategoryByCategoryId(req, res) {
    try {
      const { categoryId } = req.params;
      console.log("Category ID:", categoryId);
      const [data] = await db.execute(
        `Select * from sub_categories where category_id= ? `,
        [categoryId]
      );

      res.json({
        success: true,
        data: data
      });

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new SubCategoryController();
