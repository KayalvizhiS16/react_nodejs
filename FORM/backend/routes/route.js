const router = require("express").Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logout,
  loggedIn,
} = require("../controllers/userController");

const { checkUser } = require("../middleware/requireAuth.js");

router.use(checkUser); // Use the checkUser middleware globally

const {
  createForm,
  getForm,
  deleteForm,
  updateForm,
} = require("../controllers/formController.js");

router.get("/get-user", getUser);
router.post("/create-user", createUser);
router.patch("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/loggedIn", loggedIn);
router.post("/create-form", createForm);
router.get("/get-form", getForm);
router.delete("/delete-form/:id", deleteForm);
router.patch("/update-form/:id", updateForm);

module.exports = router;
