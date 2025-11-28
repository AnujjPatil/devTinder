const express = require("express")
const Validator= require("validator");
const profileRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const {validateEditProfile} = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user");

profileRouter.get("/profile/view",userAuth, async(req, res)=>{
 try{ 

const user = req.user


res.send(user)
 } catch(err) {
    res.status(400).send("error saving user " +err.message);
 }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
      if(!validateEditProfile(req)){
        throw new Error("Invalid update request")
      }

      const loggedInUser = req.user;
     

      Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
      

      await loggedInUser.save()

       res.json({message:"profile update sucessfully", data: loggedInUser})

    }
    catch(err){
         res.status(400).send("error " +err.message);
    }

})




profileRouter.patch("/profile/forgotpassword", userAuth, async(req, res)=>{
  try{
      const { password: newPassword } = req.body;

      if(!newPassword){
        throw new Error("Password is required");
      }

      const user = req.user;

      // Check if new password is same as old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if(isSamePassword){
        throw new Error("New password cannot be same as old password");
      }

      // Validate password strength
      if(!Validator.isStrongPassword(newPassword)){
        throw new Error("Enter a strong password");
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);

      // Use updateOne to update only password field in DB to avoid validation errors
      await User.updateOne({_id: user._id}, {password: hashPassword});

      res.json({message: "Password updated successfully"});

  }
  catch(err){
         res.status(400).send("error " +err.message);
    }
})

module.exports=profileRouter;