const express = require("express")
const userDataModel = require("../models/userData.model")
const sellerModel = require('../models/seller.model')
const registerRoute = express.Router()

registerRoute.post("/user",async (req,res) => {
    try{
    const userData = req.body

    await userDataModel.create({
        userName: userData.name,
        userEmail: userData.email,
        userPassword: userData.password
    })

    console.log(userData.name,"user created")
    res.status(200).send({
        message:`${userData.name} created successfully`
    }) 
} catch (error) {
    console.log(error)
    res.status(500).send({
        message: "Failed to create user",
        error: error.message
        })
}
}) 

<<<<<<< HEAD
module.exports = registerRoute 
=======


module.exports = registerRoute
>>>>>>> c4e8c8b6a5dcdbd4ad429e4c5701f831fd7e9e8c
