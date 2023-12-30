const mongoose = require("mongoose");


const FormSchema = new mongoose.Schema({
  formName: {
    type: String,
  },
  userName: {
    type: String,
  },
  formStructure: {
    type: Array,
  },
  submissions: {
    type: Array,
  },
  userData: mongoose.Schema.Types.Mixed,
  date: { type: String, default: new Date().toLocaleString() },
});

module.exports = mongoose.model("Form", FormSchema);
