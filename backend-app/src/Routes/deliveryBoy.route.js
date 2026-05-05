const express = require("express")
const router = express.Router()
const verifyToken = require("../middlewares/verifyToken")
const { 
    getMyDeliveries, 
    acceptDelivery, 
    completeDelivery 
} = require("../controllers/deliveryBoy.controller")

router.get("/my-deliveries", verifyToken, getMyDeliveries)
router.post("/accept", verifyToken, acceptDelivery)
router.post("/complete", verifyToken, completeDelivery)

module.exports = router
