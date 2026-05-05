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
const adminRoute = require("./src/Routes/adminRoute")           // ✅ new
const qrRoutes = require("./src/Routes/qr.Route")
const productRoute = require("./src/Routes/productRoute")
const deliveryBoyRoute = require("./src/Routes/deliveryBoy.route.js")



connectDB()
console.log(process.env.CLIENT_URL, " 0")
const corsOptions = {
    origin: [process.env.CLIENT_URL, "https://market-place-dispute-resolution-system-dan46grtm.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.set('trust proxy', 1)
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
app.use("/products", productRoute)
app.use("/product", homepageRoute)

app.use("/homepage", homepageRoute)

app.use("/evidence", evidenceRoutes)
app.use("/profile", profileRoute)         // ✅ new — GET /profile/me
app.use("/categories", categoryRoute)     // ✅ new — GET /categories
app.use("/admin", adminRoute)              // ✅ new — admin routes


app.use("/qr", qrRoutes)
app.use("/delivery-boy", deliveryBoyRoute)

// Serve uploaded evidence files statically
app.use("/uploads", express.static("uploads"))

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Accessible at http://localhost:${PORT}`);
})