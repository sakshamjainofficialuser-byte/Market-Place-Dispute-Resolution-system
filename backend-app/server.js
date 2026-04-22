require("dotenv").config()
const app = require("./src/app")
const express = require("express")
const registerRoute = require("./src/Routes/register")
const loginRoute = require("./src/Routes/login")
const homepageRoute = require("./src/Routes/Homepage")
const connectDB = require("./src/db/db")
const cors = require('cors')
const cookieParser = require("cookie-parser")
const OrderRoute = require("./src/Routes/OrderRoute")
const issueRouter = require("./src/Routes/DisputeRoute")
const evidenceRoutes = require("./src/Routes/evidenceRoute")

connectDB()

const corsOptions = {
    // 1. Specify the exact origin of your frontend (Vite's default is 5173)
    origin: 'http://localhost:5173', 
    
    // 2. Allow cookies to pass through
    credentials: true,               
    
    // 3. Optional: standard methods
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

// user's api's
app.use("/register",registerRoute)
app.use("/login",loginRoute)
app.use("/placeorder",OrderRoute)
app.use("/order",OrderRoute)
app.use("/raiseissue",issueRouter)
app.use("/homepage",homepageRoute)
app.use("/evidence", evidenceRoutes)

// also serve uploaded files statically
app.use("/uploads", express.static("uploads"))

// admin's api's


console.log("Hii")

app.listen(process.env.PORT || 3000,() => {
    console.log("Server startes running port 3000")
})