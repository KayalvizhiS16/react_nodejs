const router = require("express").Router();

const {
  createForm,
  getForm,
  deleteForm,
  updateForm,
  addSubmission,
  getSingleSubmission,
} = require("../controllers/formController.js");

router.post("/create-form", createForm);
router.get("/get-form", getForm);
router.delete("/delete-form/:id", deleteForm);
router.put("/update-form/:id", updateForm);
router.post("/add-submission/:id", addSubmission); 
router.get("/get-singleform/:id", getSingleSubmission);

module.exports = router;
