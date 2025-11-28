const express = require("express")

const requestRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req, res)=>{
 try{ 
const fromUserId= req.user._id;
const toUserId=req.params.toUserId;
const status=req.params.status;

const connectionRequest = new ConnectionRequest({
   fromUserId,
   toUserId,
   status
})

const userExist = await User.findById(toUserId)
if(!userExist){
   return res.status(400).json({message:"user not found"})
}

const allowedStatus= ["interested","ignored"];
if(!allowedStatus.includes(status)){
return res.status(400).json({message: "invalid status type" 
   + status})
}

const existingConnectionRequest = await ConnectionRequest.findOne({
   $or:[
     { fromUserId:toUserId},
     {fromUserId:toUserId, toUserId:fromUserId}
   ]
})
if(existingConnectionRequest){
   return res.status(400).json({message:"Connection request already exist"})
}


 const data = await connectionRequest.save();
 res.json({
   message:"Connection request sent succesfully",
   data
 })
 } catch(err) {
    res.status(400).send("error saving user " +err.message);
 }
})


requestRouter.post("/request/review/:status/:requestId",userAuth, async(req, res)=>{
try{
   const loggedInUser = req.user;
const {status, requestId} =req.params;

const allowedStatus = ["accepted", "rejected"]
if(!allowedStatus.includes(status)){
   return res.status(400).json({message: "status not allowed"})
}

const connectionRequest = await ConnectionRequest.findOne({
   _id: requestId,
   toUserId:loggedInUser._id,
   status:"interested"

})

if(!connectionRequest){
   return res.status(400).json({message:"connection request not found"})
}

const data= await connectionRequest.save()
res.json({message:"Connection request "+status, data})

}
catch(err){
   res.status(400).send("ERR:"+  errmessage)
}
});

module.exports=requestRouter;