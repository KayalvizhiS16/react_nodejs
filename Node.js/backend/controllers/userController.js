const user = require("../models/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
const createList = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, age, active, role } =
      req.body || {};
    console.log("Request Body:", req.body);

    //check if user is already exist
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

    //hash the password
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);

    //new user
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

    //save
    const result = await newUser.save();

    //token genreation
    const token = jwt.sign(
      {
        user: newUser._id,
      },
      process.env.JWT_SECRET
    );
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send({ message: "Data entered successfully", result, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server-side error" });
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all the data fields" });
    }
    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong email or Passwords" });
    }
    const token = jwt.sign(
      {
        user: foundUser._id,
      },
      process.env.JWT_SECRET
    );
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send({ message: "Logged in successfully", user: foundUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

//logout

const logout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send({ message: " Successfully Logged Out " });
};

//loggedIn
const loggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json(false);
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error(err, "Token is expired");
          res.json(false);
        } else {
          res.json(true);
        }
      });
    }
  } catch (error) {
    console.error(error); // Log any unexpected errors
    res.json(false);
  }
};
//update
const updateList = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body; // Assuming the updated data is sent in the request body

    // Find the user by ID and update the data
    const updatedUser = await user.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//delete
const deleteList = async (req, res) => {
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
  createList,
  updateList,
  deleteList,
  loginUser,
  logout,
  loggedIn,
};
