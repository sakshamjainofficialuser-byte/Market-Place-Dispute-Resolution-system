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

<<<<<<< HEAD
app.use(cors())

app.use(cookieParser())
=======
connectDB()
>>>>>>> e50fc5ea276f370a5511f8ebb77588f293e6ca1b

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
<<<<<<< HEAD
connectDB()

=======

// user's api's
>>>>>>> e50fc5ea276f370a5511f8ebb77588f293e6ca1b
app.use("/register",registerRoute)
app.use("/login",loginRoute)
app.use("/placeorder",OrderRoute)
app.use("/order",OrderRoute)
app.use("/raiseissue",issueRouter)
app.use("/homepage",homepageRoute)


// admin's api's


console.log("Hii")

app.listen(process.env.PORT || 3000,() => {
    console.log("Server startes running port 5000")
})