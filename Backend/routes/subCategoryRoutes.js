const express = require("express");
const router = express.Router();
const SubCategoryController = require("../controllers/subCategoryController");

// all the subcategories 
router.get("/", SubCategoryController.getAllSubCategories);

// get subcategories based on category Id
router.get("/:categoryId", SubCategoryController.getSubCategoryByCategoryId);

module.exports = router;
