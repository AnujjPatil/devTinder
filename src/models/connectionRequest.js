const moongose= require("mongoose");


const connectionRequestSchema = new moongose.Schema({
    fromUserId:{
         type:moongose.Schema.Types.ObjectId,
         ref:"User",
         required:true
    },
    toUserId:{
         type:moongose.Schema.Types.ObjectId,
         ref:"User",
         required:true
    },
    status:{
         type:String,
         enum:{
            values:["accepted", "rejected", "ignored","interested"],
            message:`{VALUE} is incorrect status type`
         }
    }
},{
    timestamps:true,
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send request to yourself")
    }
    next()
})

const ConnectionRequestModel= new moongose.model("ConnectionRequest", connectionRequestSchema)

module.exports=ConnectionRequestModel;