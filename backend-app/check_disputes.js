const mongoose = require("mongoose");
require("dotenv").config();
const Dispute = require("./src/models/Dispute.model");

async function checkDisputes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const disputes = await Dispute.find();
        console.log("Dispute Records:");
        disputes.forEach(d => {
            console.log(`ID: ${d._id}, Status: ${d.status}, Buyer: ${d.buyerId}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDisputes();
