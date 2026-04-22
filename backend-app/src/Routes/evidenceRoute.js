const express = require("express")
const router = express.Router()
const  verifyToken  = require("../middlewares/verifyToken")
const { uploadEvidence } = require("../controllers/evidence.controller")
const upload = require("../config.js/multer.config")

// upload.single("file") means expecting one file with field name "file"
router.post("/upload", verifyToken, upload.single("file"), uploadEvidence)

module.exports = router