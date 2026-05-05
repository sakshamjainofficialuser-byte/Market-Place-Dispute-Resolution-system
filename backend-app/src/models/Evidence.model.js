const mongoose = require("mongoose")

const evidenceSchema = new mongoose.Schema({
    disputeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "disputes",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ["image", "pdf", "document"],
        required: true
    }
}, {
    timestamps: true
})

const Evidence = mongoose.models.evidences || mongoose.model("evidences", evidenceSchema)
module.exports = Evidence