const express = require('express') 

const app = express() 

app.post("/buyer",(req,res)=>{
    console.log(req.body);

    res.status(200).send({
        message:"address "
    }) 

})
