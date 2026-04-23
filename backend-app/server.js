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
const profileRoute = require("./src/Routes/profileRoute")         // ✅ new
const categoryRoute = require("./src/Routes/categoryRoute")       // ✅ new

connectDB()

const corsOptions = {
    origin: [process.env.CLIENT_URL, "https://market-place-dispute-resolution-sys.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.static('dist'))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/placeorder", OrderRoute)
app.use("/order", OrderRoute)
app.use("/raiseissue", issueRouter)
app.use("/homepage", homepageRoute)
app.use("/product", homepageRoute)
app.use("/evidence", evidenceRoutes)
app.use("/profile", profileRoute)         // ✅ new — GET /profile/me
app.use("/categories", categoryRoute)     // ✅ new — GET /categories

// Serve uploaded evidence files statically
app.use("/uploads", express.static("uploads"))

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})