const express = require("express")
const { loginUser, loginSeller } = require("../controllers/login.controller")
const loginRoute = express.Router()

loginRoute.post('/seller', loginSeller)
loginRoute.post("/user", loginUser)

module.exports = loginRoute  