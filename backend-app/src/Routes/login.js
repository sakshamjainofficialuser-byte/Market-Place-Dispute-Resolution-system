const express = require("express")
const loginRoute = express.Router()


loginRoute.post("/seller",(req,res) => {
    console.log(req.body)

    res.status(200).send({
        message:"seller account created successfully"
    })
})

loginRoute.post("/user",(req,res) => {
    console.log(req.body)

    res.status(200).send({
        message:"User created successfully"
    })
})

module.exports = loginRoute