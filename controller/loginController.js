//external import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//internal imports
const User = require("../models/people");


//Get Login page
function getLogin(req, res, next){
    res.render("index");
};

//do login
async function login(req, res, next) {
    try {
        //find a who has this email/phone
        const user = await User.findOne({
            $or: [{email: req.body.username}, {email: req.body.username}],
        });

        if(user && user._id){
            //check if password is correct
            const isValidPassword = await bcrypt.compare(
                req.body.password, //this line user for people.js models
                user.password // this line use for database
            );

            //implement true & false
            if(isValidPassword){
                //perpare the user object to generate token
                const userObject = {
                    username: user.name,
                    mobile: user.mobile,
                    email: user.email,
                    role: "user",
                };

                //generate token
                const token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    // expiresIn: "1h",
                    expiresIn: process.env.JWT_EXPIRY,
                });

                //set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true,
                });

                //set logged in user local identifier
                res.locals.loggedInUser = userObject;

                res.render("inbox");

            }else{
                throw createError("Login failed! Please try again.");
            }
        }else{
            throw createError("Login failed! Please try again.");
        }
    } catch(err) {
        res.render("index", {
            data:{
                username: req.body.username,
            },
            errors: {
                common:{
                    msg: err.message,
                }
            }
            
        });
    }
};

//do logout
function logout(req, res){
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("Logged Out");
}


module.exports = {
    getLogin,
    login,
    logout,
};