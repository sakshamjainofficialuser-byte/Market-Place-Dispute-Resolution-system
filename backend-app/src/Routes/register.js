const express = require("express")
const userDataModel = require("../models/userData.model")  
const registerRoute = express.Router() 
const { register } = require("../controllers/auth.controller") 


registerRoute.post('/user',register)

registerRoute.post("/seller" ,async(req,res) => {
     try{
        const sellerData = req.body

        await userDataModel.create({
            name: sellerData.name,
            email: sellerData.email,
            password: sellerData.password,
            gstno: sellerData.gstno
        })

        console.log(sellerData.name,"user created")
        res.status(200).send({
        message:`${sellerData.name} created successfully`
    }) 
} catch (error) {
        console.log(error)
        res.status(500).send({
        message: "Failed to create seller",
        error: error.message
        })
}
})

module.exports = registerRoute


registerRoute.post("/seller" ,async(req,res) => {
     try{
        const sellerData = req.body

        await sellerModel.create({
            name: sellerData.name,
            email: sellerData.email,
            password: sellerData.password,
            gstno: sellerData.gstno
        })

        console.log(sellerData.name,"user created")
        res.status(200).send({
        message:`${sellerData.name} created successfully`
    })
} catch (error) {
        console.log(error)
        res.status(500).send({
        message: "Failed to create seller", 
        error: error.message
        })
}
}) 