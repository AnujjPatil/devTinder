const express = require("express")

const authRouter = express.Router();
const {validateSignUp} =require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");



//add user to db
authRouter.post("/signup", async (req, res) => {
 try {
  //data validation
  validateSignUp(req);
//encrpyt password
const {firstName, lastName, emailId, password} =(req.body)
const passwordHash = await  bcrypt.hash(password, 10);
  //creating a new instance of the User model
  const user = new User({firstName, lastName, emailId, password:passwordHash});
 
    await user.save();
    res.send("user added succesfully");
  } catch (err) {
    res.status(400).send("error saving user " +err.message);
  }
});

//login
authRouter.post("/login",async(req,res)=>{
  try{
       const {emailId, password} = (req.body)
       const user = await User.findOne({emailId: emailId})
       if(!user){
        throw new Error("User does not exist")
       }
      
       const isPasswordValid = await user.validatePassword(password)
       if(isPasswordValid){
        //create a token
        const token= await user.getJWT()

        res.cookie("token",token)
          res.send("Login Sucessfull!!!")
       }
       else{
        throw new Error("incorrect password")
       }
    

  }catch (err) {
    res.status(400).send("login failed: " +err.message);
  }
})

authRouter.post("/logout",async(req, res)=>{
    res.cookie("token",null, {
        expires : new Date(Date.now())
    })
    res.send("logout Sucessfull !!");
})

module.exports=authRouter;