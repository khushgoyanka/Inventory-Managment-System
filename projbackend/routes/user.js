const express = require("express");

const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  changePassword,
  forgetPassword,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);

//Get User Details
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//update profile ( user Account)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

//change Password
router.put("/user/:userId/changePassword", isSignedIn, isAuthenticated, changePassword);

//forget Password -> TODO
router.put("/user/:userId/forgetPassword", isSignedIn, isAuthenticated, forgetPassword);

module.exports = router;
