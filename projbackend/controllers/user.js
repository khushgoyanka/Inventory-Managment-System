const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //Hiding sensitive info
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $set: req.body,
    },
    {
      new: true,
      useFindAndModify: false,
    },

    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to update.",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.changePassword = (req, res) => {
  User.findById({ _id: req.profile._id })
    .then((user) => {
      if (user.authenticate(req.body.password)) {
        return res.status(401).json({
          error: "Enter new Password",
        });
      }

      user.encry_password = user.encryptPassword(req.body.password);
      user
        .save()
        .then((newUser) => {
          return res.status(200).json({
            msg: "Password Successfully updated",
            user: newUser,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "test@example.com",
  from: "test@example.com",
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

exports.forgetPassword = (req, res) => {
  sgMail.send(msg);
};
