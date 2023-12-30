const controller = require("../models/FormDataSchema");

const getForm = async (req, res) => {
  try {
    const data = await controller.find();
    console.log("getData", data);
    return res.status(200).send({ message: "Data fetched successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

const createForm = async (req, res) => {
  try {
    const { formStructure, userData, userName, formName } = req.body;

    // console.log("Form Structure:", formStructure);
    // console.log("User Data:", userData);
    // console.log("User Name:", userName);
    // console.log("Form Name:", formName);

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

    // Assuming you have a method like findByIdAndUpdate in your model
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

module.exports = { createForm, getForm, updateForm, deleteForm };
