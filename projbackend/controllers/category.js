const Category = require("../models/category");
const User = require("../models/user");
const Product = require("../models/product");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
  });
  next();
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save category in db.",
      });
    }

    User.findByIdAndUpdate(
      { _id: req.profile._id },
      { $push: { categories: cate._id } },
      (err, newUser) => {
        if (err) {
          return res.status(400).json({
            error: "User not updated successfully",
          });
        }
        return res.status(200).json({
          msg: "Category creaetd  successully",
        });
      }
    );
  });
};

exports.updateCategory = (req, res) => {
  Category.findByIdAndUpdate(
    req.category._id,
    { $set: req.body },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, cate) => {
      if (err) {
        return res.status(400).json({
          error: "Error in updating category , please try again",
        });
      }

      return res.status(200).json({
        msg: "Category updated successully",
        category: cate,
      });
    }
  );
};

exports.deleteCategory = (req, res) => {
  Category.findByIdAndDelete(req.category._id)
    .then((deletedCatgory) => {
      Product.deleteMany({ category: deletedCatgory._id }).then(() => {
        return res.status(200).json({
          status: true,
          msg: "Product under this category is removed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, cates) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    return res.status(200).json({
      msg: "All Categories",
      categories: cates,
    });
  });
};
