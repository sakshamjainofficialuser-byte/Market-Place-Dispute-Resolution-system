const express = require("express")
const { registerUser, registerSeller } = require("../controllers/auth.controller")
const registerRoute = express.Router()

registerRoute.post('/user', registerUser)

registerRoute.post("/seller", registerSeller)

module.exports = registerRoute
