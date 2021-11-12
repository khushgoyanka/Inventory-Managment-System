const User = require('../models/user')
const {
    check,
    validationResult
} = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


//Sign-up
exports.signup = (req, res) => {
    // Save user to the database.
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()[0].msg
        });
    }
    const user = new User(req.body)

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: err
            })
        }
        // return res.json(user) 
        // or
        return res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
}

//sign-in
exports.signin = (req, res) => {
    const {
        email,
        password
    } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()[0].msg
        });
    }

    User.findOne({
        email
    }, (err, user) => {
        if (err || !user) {
            res.status(400).json({
                errors: "User email does not exit."
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                errors: 'Email and password do not match.'
            })
        }

        //if email and pass match:
        // create a token
        const token = jwt.sign({
            _id: user._id
        }, process.env.SECRET)
        //put token in cookie
        res.cookie("token", token, {
            expire: new Date() + 9999
        })

        //send res to front-end
        const {
            _id,
            name,
            email,
            role
        } = user
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: 'Signed out...'
    })
}




//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: 'auth'
})

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED."
        })
    }
    next();
}