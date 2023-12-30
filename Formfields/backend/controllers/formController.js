const controller = require("../models/FormDataSchema");

const getForm = async (req, res) => {
  try {
    const data = await controller.find();
    return res.status(200).send({ message: "Data fetched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

const submitForm = async (req, res) => {
  try {
    const { formStructure, userData, userName, formName } = req.body;
    const userForm = new controller({
      formName,
      formStructure,
      userName,
      userData,
    });
    await userForm.save();
    res.status(200).send({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { formStructure, submissions } = req.body;
    await controller.findByIdAndUpdate(id, { formStructure, submissions });
    res.status(200).send({ message: "Form updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).send({ message: "Required field is missing" });
    }
    const deletedForm = await controller.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User data deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

module.exports = { submitForm, getForm, updateForm, deleteForm };
