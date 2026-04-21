const express = require("express")
const router = express.Router()
const raiseDispute = require("../controllers/raiseDispute.controller")
const verifyToken = require("../middlewares/verifyToken")

router.post("/issue",verifyToken,raiseDispute)

module.exports = router