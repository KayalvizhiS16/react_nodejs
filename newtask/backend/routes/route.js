const router = require("express").Router();
const{checkUser}=require("../middleware/requireAuth");
router.use(checkUser);
router.get('/user',(req,res) => {
  const {user} =res.locals;
  if(user){
      res.status(200).send({user})
  }
  else{
      res.status(401).send({message: "Invalid username or password"})
  }
})

const {
  createList,
  getUser,
  updateList,
  deleteList,
  loginUser,
  logout,
  loggedIn,
  createForm,
  getForm,
  updateForm,
  deleteForm,
} = require("../controllers/userController");

router.get("/get-user", getUser);
router.post("/create-list", createList);
router.patch("/update-list/:id", updateList);
router.delete("/delete-list/:id", deleteList);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/loggedIn", loggedIn);
router.get("/get-form", getForm);
router.post("/create-form", createForm);
router.patch("/update-form/:id", updateForm);
router.delete("/delete-form/:id", deleteForm);
module.exports = router;
