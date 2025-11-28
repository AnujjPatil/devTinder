const express = require("express")
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth")
const ConnectionRequest=require("../models/connectionRequest")

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{

try{
const loggedInUser = req.user

const connectionRequest = await ConnectionRequest.find({
    toUserId: loggedInUser._id  ,
    status:"interested"
}).populate("fromUserId","firstName lastName gender age photoUrl about skills")

res.json({message:"Data fetched succesfully", data: connectionRequest})
}
catch(err){
   res.status(400).send("ERR:"+  err.message)
}
})


userRouter.get("/user/connections", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName gender age photoUrl about skills").populate("toUserId","firstName lastName gender age photoUrl about skills")

        const data= connectionRequest.map((row)=>{
        if(row.fromUserId._id.toSting() === loggedInUser._id.toSting()){
            return row.toUserId
        }
        return row.fromUserId
     } )

        res.json({data})
    }
    catch(err){
       res.status(400).send("ERR:"+  err.message)
    }
})

module.exports= userRouter;