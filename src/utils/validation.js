const Validator = require("validator")

const validateSignUp=(req)=>{
const {firstName, lastName, emailId, password} = req.body

if(!firstName || ! lastName){
    throw new Error("Name is not valid!!")

}
else if(!Validator.isEmail(emailId)){
    throw new Error("Email is not valid")
}
else if(!Validator.isStrongPassword(password)){
    throw new Error("Please enter strong password");
}
}

const validateEditProfile=(req)=>{
    const allowedEditFields=["firstName", "lastName", "age","gender","about","photoUrl","skills"];

   const isAllowedEdit = Object.keys(req.body).every((field)=> allowedEditFields.includes(field))

   return isAllowedEdit;
}

module.exports={
    validateSignUp,
    validateEditProfile,
}