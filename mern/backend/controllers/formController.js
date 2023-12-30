const controller = require("../models/FormDataSchema");

const getForm = async (req, res) => {
  try {
    const data = await controller.find();
    return res.status(200).send({ message: "Data fetched successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

const createForm = async (req, res) => {
  try {
    const { formStructure, userName, formName } = req.body;
    const userForm = new controller({
      formName,
      formStructure,
      userName,
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
    const { _id } = req.params || req.body;
    const { formStructure, submissions } = req.body;
    await controller.findByIdAndUpdate(_id, { formStructure, submissions });
    res.status(200).send({ message: "Form updated successfully", submissions });
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

const addSubmission = async (req, res) => {
  try {
    const { id } = req.params || req.body;
    const { submissions } = req.body;
    const existingForm = await controller.findById(id);
    if (!existingForm) {
      return res.status(404).send({ message: "Form not found" });
    }
    existingForm.submissions.push(submissions);
    await existingForm.save();
    res
      .status(200)
      .send({ message: "Submission added successfully", form: existingForm });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};

const getSingleSubmission = async (req, res) => {
  try {
    const { id } = req.params || {};
    const findForm = await controller.findById(id);
    if (!findForm) {
      return res.status(404).send({ message: "Form not found" });
    }
    return res
      .status(200)
      .send({ message: "Submitted data to show", RequestedForm: findForm });
  } catch (error) {
    return res.status(500).send({ message: "Server error", error: error });
  }
};

module.exports = {
  createForm,
  getForm,
  updateForm,
  deleteForm,
  addSubmission,
  getSingleSubmission,
};
