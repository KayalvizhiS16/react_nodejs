const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  role: {
    type: String,
  },
  active: {
    type: Boolean,
  },
});

module.exports = mongoose.model("userSchema", userSchema);
