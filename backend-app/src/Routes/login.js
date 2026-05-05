const express = require("express")
const { loginUser, loginSeller, loginAdmin, loginDeliveryBoy } = require("../controllers/login.controller")
const loginRoute = express.Router()

loginRoute.post('/seller', loginSeller)
loginRoute.post("/user", loginUser)
loginRoute.post("/admin", loginAdmin)
loginRoute.post("/delivery_boy", loginDeliveryBoy)

module.exports = loginRoute