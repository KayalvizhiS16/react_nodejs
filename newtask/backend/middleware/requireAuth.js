const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const requireAuth = async (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        return res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    return res.redirect("/login");
  }
};

const checkUser = async (req, res, next) => {
  const token = req.cookies && req.cookies.token;

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

module.exports = { requireAuth, checkUser };
