const mongoose = require("mongoose");
require("dotenv").config();
const Evidence = require("./src/models/Evidence.model");

async function checkEvidence() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const evidences = await Evidence.find();
        console.log("Evidence Records:");
        evidences.forEach(e => {
            console.log(`ID: ${e._id}, DisputeID: ${e.disputeId}, Path: ${e.fileUrl}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkEvidence();
