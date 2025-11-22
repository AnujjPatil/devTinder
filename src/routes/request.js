const express = require("express")

const requestRouter = express.Router()
const {userAuth} = require("../middleware/auth")

requestRouter.post("/sendConnectionRequest",userAuth, async(req, res)=>{
 try{ 

const user = req.user
res.send(user.firstName + "send the connection request")
 } catch(err) {
    res.status(400).send("error saving user " +err.message);
 }
})


module.exports=requestRouter;