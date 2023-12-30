const router = require("express").Router();

const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  loggedIn,
} = require("../controllers/userController");

const { requireAuth } = require("../middleware/requireAuth.js");

// router.use(requireAuth); // Use the checkUser middleware globally

router.get("/get-user", getUser);
router.post("/create-user", createUser);
router.patch("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);
router.post("/login", loginUser);
router.get("/loggedin", requireAuth, loggedIn);

module.exports = router;
