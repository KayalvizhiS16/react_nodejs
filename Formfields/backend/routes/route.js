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

router.get("/getuser", getUser);
router.post("/createuser", createUser);
router.patch("/updateuser/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);
router.post("/login", loginUser);
router.get("/loggedin", requireAuth, loggedIn);

module.exports = router;
