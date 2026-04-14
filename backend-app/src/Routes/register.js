const express = require("express")
const {registerUser,registerSeller} = require("../controllers/auth.controller")
const registerRoute = express.Router()

registerRoute.post('/user',registerUser)
// registerRoute.post("/user",async (req,res) => {

//     const userData = req.body
//     console.log(userData)
//     try{
   
//     await userDataModel.create({
//         userName: userData.username,
//         userEmail: userData.email,
//         userPassword: userData.password
//     })

//    console.log(userData.name,"user created")

//     res.status(200).send({
//         message:`${userData.username} created successfully`
//     })
// } catch (error) {
//     console.log(error)
//     res.status(500).send({
//         message: "Failed to create user",
//         error: error.message
//         })
// }
// }) 

registerRoute.post("/seller",registerSeller)

// registerRoute.post("/seller" ,async(req,res) => {
//      try{
//         const sellerData = req.body

//         await sellerModel.create({
//             name: sellerData.name,
//             email: sellerData.email,
//             password: sellerData.password,
//             gstno: sellerData.gstno
//         })

//         console.log(sellerData.name,"user created")
//         res.status(200).send({
//         message:`${sellerData.name} created successfully`
//     })
// } catch (error) {
//         console.log(error)
//         res.status(500).send({
//         message: "Failed to create seller",
//         error: error.message
//         })
// }
// })

module.exports = registerRoute
