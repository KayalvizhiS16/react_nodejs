// const mongoose = require("mongoose");

// const formSchema = new mongoose.Schema({
//   formStructure: {
//     type: Array,
//   },
//   date: { type: String, default: new Date().toISOString() },
// });

// module.exports = mongoose.model("Form", formSchema);

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
  date: { type: String, default: new Date().toLocaleString() },
});

module.exports = mongoose.model("Form", FormSchema);
