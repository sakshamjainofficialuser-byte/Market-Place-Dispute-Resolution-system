const express = require("express")
const router = express.Router()
const verifyToken = require("../middlewares/verifyToken")
const upload = require("../config.js/multer.config")
const {
    generateQRForOrder,
    scanQRCode,
    getTrackingTimeline
} = require("../controllers/qr.controller")

router.post("/generate", verifyToken, generateQRForOrder)
// Accept up to 10 photo files under the field name "photos"
router.post("/scan", verifyToken, upload.array("photos", 10), scanQRCode)
router.get("/timeline/:orderItemId", verifyToken, getTrackingTimeline)

module.exports = router