const express = require("express")

const profileRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const {validateEditProfile} = require("../utils/validation")


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
module.exports=profileRouter;