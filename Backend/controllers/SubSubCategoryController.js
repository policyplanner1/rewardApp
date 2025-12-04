
const db = require("../config/database");

class SubSubCategoryController {

  // Get all categories
  async getAllSubSubCategories(req, res) {
    try {
      const [rows] = await db.execute(`SELECT * FROM sub_sub_categories LEFT JOIN sub_categories on sub_sub_categories.subcategory_id=sub_categories.subcategory_id`);

      res.json({
        success: true,
        data: rows
      });

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getSubSubCategoryBySubCategoryId(req, res) {
    try {
      const { subcategoryId } = req.params;

      const [data] = await db.execute(
        `Select * from sub_sub_categories where subcategory_id= ? `,
        [subcategoryId]
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

module.exports = new SubSubCategoryController();
