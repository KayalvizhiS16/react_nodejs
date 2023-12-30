const {
  getUser,
  createList,
  updateList,
  deleteList,
  loggedIn,
  loginUser,
  logout,
 
} = require("../controllers/userController");
const {requireAuth ,checkUser} = require("../middleware/requireAuth.js")
 const router=require('express').Router();
router.use(checkUser);
 
router.get('/user',(req,res) => {
    const {user} =res.locals;
    if(user){
        res.status(200).json({user})
    }
    else{
        res.status(401).json({message: "Invalid username or password"})
    }
})


router.get("/getUser", getUser);
router.post("/createList", createList);
router.patch("/updateList/:id", updateList);
router.delete("/deleteList/:id", deleteList);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/loggedIn", loggedIn);
module.exports = router;
