const Evidence = require("../models/Evidence.model")

async function uploadEvidence(req, res) {
    try {
        // Multer stores file info in req.file
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const { disputeId } = req.body

        // determine file type
        let fileType = "document"
        if (req.file.mimetype.startsWith("image")) {
            fileType = "image"
        } else if (req.file.mimetype === "application/pdf") {
            fileType = "pdf"
        }

        // create evidence record
        const evidence = await Evidence.create({
            disputeId: disputeId,
            uploadedBy: req.user._id,  // from verifyToken
            fileUrl: req.file.path,    // uploads/filename.jpg
            fileType: fileType
        })

        res.status(201).json({
            message: "Evidence uploaded successfully",
            evidence
        })

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

module.exports = { uploadEvidence }