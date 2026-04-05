const express = require("express")
const {loginUser} = require("../controllers/login.controller")
const loginRoute = express.Router()


loginRoute.post("/seller",(req,res) => {
    console.log(req.body)
    

    res.status(200).send({
        message:"seller account created successfully"
    })
})

loginRoute.post("/user",loginUser)

module.exports = loginRoute
