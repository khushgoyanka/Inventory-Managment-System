const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

// Create Product

// {
//   name : "",
//   description : "",
//   price : "",
//   stock : "",
//   category : ObjectID ,
//   userID : ObjectId
// }

exports.createProduct = (req, res) => {
  const product = new Product(req.body);
  product
    .save()
    .then((newProduct) => {
      return res.status(200).json({
        msg: "New Product is Added To the List",
        product: newProduct,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//update product
exports.updateProduct = (req, res) => {
  Product.findByIdAndUpdate(req.product._id, { $set: req.body }, { new: true })
    .then((updatedProduct) => {
      return res.status(200).json({
        status: true,
        msg: "Product updated Successfully",
        product: this.updatedProduct,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//delete controller
exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, removedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product",
      });
    }
    res.json({
      message: "Deletion was success",
      deletedProduct: removedProduct,
    });
  });
};

//listing products based on category wise
exports.getAllProducts = (req, res) => {
  Product.find({ userId: req.profile._id })
    .sort({ category: "asc" })
    .populate("category", "name")
    .then((products) => {
      return res.status(200).json({
        status: true,
        msg: "Products send succeffully",
        products,
      });
    })
    .catch((err) => console.log(err));
};
