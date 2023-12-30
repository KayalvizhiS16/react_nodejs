const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
let db=[];
//GET METHODS
app.get("/get-object",async(_,res)=>{
    try{
       return  res.status(200).send({message:"data  fetched successfully ",data:db})
    }catch(error){
        console.log(error);
       return res.status(500).send({message:"server error"});
    }
   
});

app.post("/create-list",async(req,res)=>{
    try{
      console.log(req.body);
      const{
        id="", firstName="",lastName="",email="", gender="",age=null,active=false}= req.body ||{};
      if(!id && !firstName && !lastName && !email && !gender && !age && !active)
     return res.status(400).send({message:"required field missing"});
      db.push( {id,firstName,lastName,email,gender,age,active});
      return res.status(200).send({message:"userlist added sucessfully"});
    }catch(error){
        console.log(error);
       return res.status(500).send({message:"server error"});
    }
   
})
app.patch("/update-list",async(req,res)=>{
    try{
        const data = req.body || {};
        console.log(data);
        if (data.id==="") {
            return res.status(400).send({ message: "Required field is missing" });
        }
        const index = db.findIndex((i) => i.id == data.id);
        console.log(index);
        if (index === -1) {
          return res.status(404).send({ message: "Data not found" });
        }
        db[index]=data;
        return res.status(200).send({ message: "data inserted successfully" });
    }catch(error){
        return res.status(500).send({ message: "Server error" });
    }
})
app.delete("/delete-list",async(req,res)=>{
    try{
        console.log(req.body);
        const{id=""}=req.body||{};
        console.log(id);
        if (!id) {
            return res.status(400).send({ message: "Required field is missing" });
        }
        const index = db.findIndex((a)=>a.id==id);
        console.log(index);
        if (index===-1) {
            return res.status(400).send({ message: "data not found" });
        }
       
        db.splice(index,1);
       return res.status(200).send({ message: " member deleted successfully"});

    }catch (error) {
        return res.status(500).send({ message: "Server error" });
    }
})
app.listen(5000, () => {
    console.log("server running on 5000");
  });