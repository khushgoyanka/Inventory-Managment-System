const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  updateProduct,
  removeProduct,
  getAllProducts,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

//Create Product
router.post("/product/create/:userId", isSignedIn, isAuthenticated, createProduct);

//update Product
router.put("/product/update/:productId/:userId", isSignedIn, isAuthenticated, updateProduct);

//Delete Particular Product
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, removeProduct);

// Show All Products Sorted Cateogry Wise
router.get("/products/:userId", getAllProducts);

module.exports = router;
