const express = require("express")
const router = express.Router()
const {raiseDispute} = require("../controllers/raiseDispute.controller")
const verifyToken = require("../middlewares/verifyToken")
const {isAdmin} = require("../middlewares/isAdmin")
const {getAllDisputes} = require("../controllers/raiseDispute.controller")
const {getDisputeDetails} = require("../controllers/raiseDispute.controller")

router.post("/raise",verifyToken,raiseDispute)

router.get("/all", verifyToken, isAdmin, getAllDisputes)
router.get("/:disputeId", verifyToken, getDisputeDetails)
module.exports = router