require("dotenv").config()
const app = require("./src/app")
const express = require("express")
const registerRoute = require("./src/Routes/register")
const loginRoute = require("./src/Routes/login")
const connectDB = require("./src/db/db")

connectDB()
app.use(express.json())
app.use("/register",registerRoute)
app.use("/login",loginRoute)


console.log("Hii")

app.listen(process.env.PORT || 3000,() => {
    console.log("Server startes running port 3000")
})