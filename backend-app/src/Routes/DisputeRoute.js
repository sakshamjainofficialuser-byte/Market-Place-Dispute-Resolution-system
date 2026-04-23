const express = require("express")
const router = express.Router()
const { raiseDispute } = require("../controllers/raiseDispute.controller")
const { getAllDisputes } = require("../controllers/raiseDispute.controller")
const { getDisputeDetails } = require("../controllers/raiseDispute.controller")
const { getMyDisputes } = require("../controllers/raiseDispute.controller")       // ✅ new
const { sellerRespond } = require("../controllers/raiseDispute.controller")       // ✅ new
const { resolveDispute } = require("../controllers/resolution.controller")         // ✅ new
const verifyToken = require("../middlewares/verifyToken")
const { isAdmin } = require("../middlewares/isAdmin")

// Buyer: raise a new dispute
router.post("/raise", verifyToken, raiseDispute)

// Buyer: get their own disputes
router.get("/my-disputes", verifyToken, getMyDisputes)                            // ✅ new

// Admin: get all disputes
router.get("/all", verifyToken, isAdmin, getAllDisputes)

// Admin: resolve a dispute
router.post("/:disputeId/resolve", verifyToken, isAdmin, resolveDispute)          // ✅ new

// Seller: respond to a dispute (FBM)
router.post("/:disputeId/respond", verifyToken, sellerRespond)                    // ✅ new

// Anyone: get details of one dispute
router.get("/:disputeId", verifyToken, getDisputeDetails)

module.exports = router