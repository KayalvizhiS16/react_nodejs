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
router.post("/login",loginUser);
router.get("/get-user",requireAuth,getUser);
router.post("/create-user", createUser);
router.patch("/update-user/:id", requireAuth,updateUser);
router.delete("/delete-user/:id", requireAuth,deleteUser);
router.get("/loggedin", requireAuth, loggedIn);

module.exports = router;
