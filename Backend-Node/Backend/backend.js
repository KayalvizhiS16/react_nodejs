const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes/route')
app.use('/',routes)
dotenv.config()
mongoose
.connect(process.env.MongoDBURL)
   .then(()=>console.log("DB connection established"))
 .catch(err=>console.log(err))
 const port = process.env.PORT||4000;


app.post("/create-list", async (req, res) => {
    try {
        console.log(req.body);
        const {
            firstName, lastName, email, gender,age,active } = req.body || {};
        if (!firstName || !lastName || !email || !gender)
            return res.status(400).json({ message: "Required field missing" });
        const userData = new UserModel({ firstName, lastName, email, gender,age,active });
        await userData.save();
        return res.status(200).send({ message: "userlist added sucessfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "server error" });
    }

})
// app.patch("/update-list/:id", async (req, res) => {
//     try {
//         console.log(req.body);
//         const { id = "" } = req.params || {};
//         console.log(id);
//         if (!id)return res.status(400).send({ message: "Required field is missing" });
//             const {
//                 firstName, lastName, email, gender,age,active } = req.body || {};
//             if ( !firstName || !lastName || !email || !gender || !age || !active)
//                 return res.status(400).json({ message: "Required field missing" });
//         const userData = await UserModel.findById(id)
//         if (!userData)
//             return res.status(400).send({ message: "Data not found" });
//         userData.firstName=firstName;
//         userData.lastName=lastName;
//         userData.email=email;
//         userData.gender=gender;
//         userData.age=age;
//         userData.active=active;
//         await userData.save();
//             return res.status(200).send({ message: " member updated successfully" });

//     } catch (error) {
//         return res.status(500).send({ message: "Server error" });
//     }
// })
// app.delete("/delete-list/:id", async (req, res) => {
//     try {
//         console.log(req.body);
//         const { id = "" } = req.params || {};
//         console.log(id);
//         if (!id)
//             return res.status(400).send({ message: "Required field is missing" });

//         await UserModel.findByIdAndDelete(id)

//         return res.status(200).send({ message: " member deleted successfully" });

//     } catch (error) {
//         return res.status(500).send({ message: "Server error" });
//     }
// })
app.listen(5000, () => {
    console.log("server running on 5000");
});