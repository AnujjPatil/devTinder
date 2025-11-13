const mongoose=require('mongoose');

const connectDB =async()=>{
    await mongoose.connect(
        "mongodb+srv://patilanuj568_db_user:8xfVfqewIo6u1iMA@demonode.i8pxkdl.mongodb.net/devtinder"
    )
}
module.exports= connectDB

// connectDB().then(()=>{
//     console.log("database connected")
// }).catch((err)=>{
//     console.log("database not connected")
// })  