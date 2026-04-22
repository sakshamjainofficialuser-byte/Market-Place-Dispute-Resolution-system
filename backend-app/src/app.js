const express = require("express")
const app = express()

const evidenceRoutes = require("./Routes/evidenceRoute")
app.use("/evidence", evidenceRoutes)

// also serve uploaded files statically
app.use("/uploads", express.static("uploads"))

module.exports = app