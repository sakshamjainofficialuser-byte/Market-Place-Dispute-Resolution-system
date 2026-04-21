require("dotenv").config()
const app = require("./src/app")
const express = require("express")
const registerRoute = require("./src/Routes/register")
const loginRoute = require("./src/Routes/login")
const homepageRoute = require("./src/Routes/Homepage")
const connectDB = require("./src/db/db")
const cors = require('cors')
const cookieParser = require("cookie-parser")

app.use(cors())

app.use(cookieParser())

app.use(express.json())
connectDB()

app.use("/register",registerRoute)
app.use("/login",loginRoute)


app.use("/homepage",homepageRoute)

console.log("Hii")

app.listen(process.env.PORT || 3000,() => {
    console.log("Server startes running port 5000")
})