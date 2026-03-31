const express = require("express")
const registerRoute = express.Router()
const { registerUser,registerSeller } = require("../controllers/auth.controller")


registerRoute.post('/user',registerUser)
registerRoute.post('/seller',registerSeller)

module.exports = registerRoute 