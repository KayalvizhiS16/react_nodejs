const router = require("express").Router();

const {
  createList,
  getUser,
  updateList,
  deleteList,
  loginUser,
  logout,
  loggedIn,
} = require("../controllers/userController");

router.get("/getUser", getUser);
router.post("/createList", createList);
router.patch("/updateList/:id", updateList);
router.delete("/deleteList/:id", deleteList);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/loggedIn", loggedIn);
module.exports = router;
