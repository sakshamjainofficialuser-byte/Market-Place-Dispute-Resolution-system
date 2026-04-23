const express = require("express")
const router = express.Router()
const { getMyProfile } = require("../controllers/profile.controller")
const verifyToken = require("../middlewares/verifyToken")

// GET /profile/me  — returns logged-in user info + stats
router.get("/me", verifyToken, getMyProfile)

module.exports = router
