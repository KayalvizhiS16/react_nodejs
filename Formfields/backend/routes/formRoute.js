const router = require("express").Router();

const {
  submitForm,
  getForm,
  deleteForm,
  updateForm,
} = require("../controllers/formController.js");

router.post("/submitform", submitForm);
router.get("/getform", getForm);
router.delete("/deleteform/:id", deleteForm);
router.patch("/updateform/:id", updateForm);

module.exports = router;
