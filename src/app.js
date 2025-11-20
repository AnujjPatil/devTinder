const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");
const {validateSignUp} =require("./utils/validation");
const bcrypt = require("bcrypt")
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken")
const {userAuth} = require("./middleware/auth")

app.use(express.json()); //middleware
app.use(cookieParser());


//add users to db
app.post("/signup", async (req, res) => {
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
app.post("/login",async(req,res)=>{
  try{
       const {emailId, password} = (req.body)
       const user = await User.findOne({emailId: emailId})
       if(!user){
        throw new Error("User does not exist")
       }
      
       const isPasswordValid = await bcrypt.compare(password, user.password)
       if(!isPasswordValid){
        //create a token
        const token= await jwt.sign({_id:user._id},"dev@Tinder10")

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

//get profile
app.get("/profile",userAuth, async(req, res)=>{
 try{ 

const user = req.user
res.send(user)
 } catch(err) {
    res.status(400).send("error saving user " +err.message);
 }
})


//get user by email - get one user
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//feed api= api to get all users
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete user api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted sucessfullyy");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update user data
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [photoURl, about, skills];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated sucessfully");
  } catch (err) {
    res.status(400).send("update failed: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connected");

    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("database not connected");
  });
