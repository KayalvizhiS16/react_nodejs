const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { response } = require("express");

const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        try {
          const authorizedUser = await User.findById(decodedToken.user);
          res.locals.user = authorizedUser;
          next();
        } catch (error) {
          console.error(error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { checkUser };
