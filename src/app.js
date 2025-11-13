const express = require('express');
const connectDB =require("./config/database")
 
const app=express();
const User=require("./models/user")

app.use(express.json())//middleware

//add users to db
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

//get user by email - get one user
app.get('/user',async (req,res)=>{
   
    const userEmail= req.body.emailId;
try{
 const user=await User.find({ emailId: userEmail})
 if(user.length===0){
    res.status(404).send("user not found")
 }
 else{
    res.send(user)
 }
}
catch(err){
  res.status(400).send("Something went wrong")
}


})

//feed api= api to get all users
app.get('/feed',async (req, res)=>{
try{
const user= await User.find({});
res.send(user)
}
catch(err){
     res.status(400).send("Something went wrong")
}
})

//delete user api
app.delete("/user",async(req, res)=>{
    const userId= req.body.userId
    try{
 const user = await User.findByIdAndDelete({_id: userId})
 res.send("user deleted sucessfullyy")
}
catch(err){
     res.status(400).send("Something went wrong")
}
})

//update user data
app.patch('/user',async(req, res)=>{
    const userId = req.body.userId
const data =req.body

     try{
       await User.findByIdAndUpdate({_id: userId}, data)
       res.send("User updated sucessfully")
}
catch(err){
     res.status(400).send("Something went wrong")
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
