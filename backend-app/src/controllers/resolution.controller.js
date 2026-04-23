const resolutionModel = require("../models/resolution.model")
const DisputeModel = require("../models/Dispute.model")
const userDataModel = require("../models/userData.model")

// ─── Admin: Resolve a dispute ─────────────────────────────────────────────────
async function resolveDispute(req, res) {
    try {
        const { disputeId } = req.params
        const { decision, note } = req.body   // decision: "Refund" | "Replacement" | "Rejected"

        if (!decision || !note) {
            return res.status(400).json({ message: "decision and note are required" })
        }

        const dispute = await DisputeModel.findById(disputeId)
        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" })
        }

        if (dispute.status === "Resolved") {
            return res.status(400).json({ message: "Dispute is already resolved" })
        }

        // Create the resolution record
        const resolution = await resolutionModel.create({
            disputeId: dispute._id,
            resolvedBy: req.user._id,   // admin's id from JWT
            decision,
            note
        })

        // Mark the dispute as Resolved and assign the admin
        dispute.status = "Resolved"
        dispute.adminId = req.user._id
        await dispute.save()

        res.status(201).json({
            message: "Dispute resolved successfully",
            resolution,
            dispute
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { resolveDispute }