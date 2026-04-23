const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: true
    },
    orderItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderItems",
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending","Under Review","Resolved"],
        default: "Pending"
    },
    fulfillmentType: {
        type: String,
        enum: ["FBA", "FBM"],
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
        // not required — assigned later when admin picks up the case
    },
    // ✅ For FBM disputes — seller writes their side of the story
    sellerResponse: {
        type: String,
        default: null
    }
},{
        timestamps: true
    })

const Dispute = mongoose.model("disputes",disputeSchema)
module.exports = Dispute