const mongoose=require('mongoose');
const Validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
    minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must be at most 50 characters"],
      trim: true,

    },
     lastName: {
        type:String,
        trim: true,
    },
     emailId: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
         if(!Validator.isEmail(value)){
            throw new Error("Invalid email")

         }
        }
    },
     password: {
        type:String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
     age: {
        type:Number,
     min: [18, "Age must be at least 18"],
    },
     gender: {
        type:String,
        validate(value){
            if(!["male", "female","others"].includes(value)){
               throw new Error("Invalid gender data")
            }
        },
        
    },
    photoUrl:{
        type:String,
        default:"https://cdn.vectorstock.com/i/500p/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg"
    },
    about:{
        type:String,
        default:"This is default about",
         trim: true,
      maxlength: [300, "About section can be max 300 characters"],
    },
    skills:{
        type:[String],
    }


},
{
    timestamps:true,
})

const User = mongoose.model("User", userSchema);

module.exports= User;

