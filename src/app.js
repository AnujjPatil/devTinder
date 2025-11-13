const express = require('express');
const connectDB =require("./config/database")
 
const app=express();
const User=require("./models/user")

app.use(express.json())//middleware

app.post("/signup",async (req, res)=>{
//creatina a new instance of the User model
    const user =new User(req.body);

    try{
    await user.save();
    res.send("user added succesfully")
    } catch(err){
        res.status(400).send('error saving user')
    }
})



connectDB()
.then(()=>{
console.log("database connected")

app.listen(3000,()=>{
console.log("server is listening on port 3000")
});
}).catch((err)=>{
    console.log("database not connected")
})  
