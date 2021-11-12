const crypto = require("crypto");
const { ObjectId } = require("mongoose");
var mongoose = require("mongoose");
const { v1: uuidv1 } = require("uuid");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    categories: [{ type: ObjectId, ref: "Category" }],
    products: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainPass) {
    return this.encryptPassword(plainPass) === this.encry_password;
  },

  encryptPassword: function (plainPass) {
    if (!plainPass) return "Empty Password is not allowed"; //returning empty string means mongodb wont store empty string as pass so it will give error.
    try {
      return crypto.createHmac("sha256", this.salt).update(plainPass).digest("hex");
    } catch (error) {
      return "Some Error is come , Please try again";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
