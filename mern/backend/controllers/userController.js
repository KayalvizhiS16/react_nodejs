const user = require("../models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create token
const createToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

//get
const getUser = async (req, res) => {
  try {
    const db = await user.find();

    if (db.length) {
      return res.status(200).send({ message: "Data fetched successfully", db });
    } else {
      return res.status(404).send({ message: "No data fund in the DB" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server  side error" });
  }
};

//registration
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, age, active, role } =
      req.body || {};
    console.log("Request Body:", req.body);
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, Please login" });
    }
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !age ||
      active === undefined ||
      !role
    ) {
      console.log("Invalid Data:", {
        firstName,
        lastName,
        email,
        password,
        gender,
        age,
        active,
        role,
      });
      return res
        .status(400)
        .send({ message: "Invalid data. All fields are required." });
    }
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);
    const newUser = new user({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      gender,
      age,
      role,
      active,
    });
    const result = await newUser.save();
    const token = createToken(newUser);
    res.status(200).json({ message: "Registered successfully", result, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).send({ message: "Required field is missing" });
    }
    const loginuser = await user.findOne({ email: email });
    if (!loginuser) {
      return res.status(401).send({ message: "Invalid email or password!" });
    }
    try {
      const passwordcheck = bcrypt.compare(password, loginuser.password);
      if (!passwordcheck) {
        return res.status(401).send({ message: "Invalid email or password!" });
      }
      const token = createToken(loginuser);
      res.status(200).send({
        message: "Logged in successfully",
        loginuser,
        token,
      });
    } catch (bcryptError) {
      console.error("Error comparing passwords:", bcryptError);
      return res.status(400).send({ message: "Email or password is invalid" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

//loggedin
const loggedIn = async (req, res) => {
  const userData = res.locals;
  const { _id } = userData.user;
  try {
    const foundUser = await user.findOne({ _id: _id }); // Assuming your model is named User
    console.log(foundUser);

    res
      .status(200)
      .json({ message: "Authorized person", foundUser: foundUser });
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: "Server Error" });
  }
};

//update
const updateUser = async (req, res) => {
  try {
    const updatedUserData = req.body; // Assuming the updated data is sent in the request body
    const { id } = req.params;
    const updatedUser = await user.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//delete
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).send({ message: "Required field is missing" });
    }

    const deletedUser = await user.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({ message: "User data deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  loggedIn,
};
