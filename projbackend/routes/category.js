const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Create Category
router.post("/category/create/:userId", isSignedIn, isAuthenticated, createCategory);

// Delete Category + Delete all the products enlisted with in that category
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, deleteCategory);

// Update Category
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, updateCategory);

// All Catgeories
router.get("/categories", getAllCategory);

module.exports = router;
