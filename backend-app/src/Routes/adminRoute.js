const express = require("express")
const router = express.Router()
const verifyToken = require("../middlewares/verifyToken")
const { isAdmin } = require("../middlewares/isAdmin")

const { 
    assignDeliveryBoy,
    getPendingDeliveryItems,
    getAvailableDeliveryBoys
} = require("../controllers/admin.controller")

// GET /admin/verify - Verify if current user is an admin
router.get("/verify", verifyToken, isAdmin, (req, res) => {
    res.status(200).json({
        message: "Admin verified",
        user: req.user
    })
})

router.get("/pending-deliveries", verifyToken, isAdmin, getPendingDeliveryItems)
router.get("/delivery-boys", verifyToken, isAdmin, getAvailableDeliveryBoys)
router.post("/assign-delivery", verifyToken, isAdmin, assignDeliveryBoy)

module.exports = router
