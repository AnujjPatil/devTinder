const mongoose=require('mongoose');
require("dotenv").config()

const connectDB =async()=>{
    await mongoose.connect(process.env.MONGO_URI)
}
module.exports= connectDB

// connectDB().then(()=>{
//     console.log("database connected")
// }).catch((err)=>{
//     console.log("database not connected")
// })  