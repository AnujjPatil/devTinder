const express = require('express');
const app=express();

app.get('/',(req , res)=>{
    res.send("hello world")
})

app.use('/demo',(req , res)=>{
    res.send("oyoyoyoy")
})

app.listen(3000,()=>{
    console.log("server is listening on port 3000")
});