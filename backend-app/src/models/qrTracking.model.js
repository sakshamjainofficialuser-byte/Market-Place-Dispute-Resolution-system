const mongoose = require("mongoose")

const qrTrackingSchema = new mongoose.Schema({
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
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    qrCode: {
        type: String,
        required: true,
        unique: true
    },
    qrCodeImageUrl: String,

    timeline: [{
        stage: {
            type: String,
            enum: ["seller_handoff", "delivery_pickup", "in_transit", "delivered"],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now()
        },
        scannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        location: {
            latitude: Number,
            longitude: Number,
            address: String
        },
        photos: [{
            url: String,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            timestamp: Date,
            description: String
        }],
        notes: String,
        signature: String
    }],

    currentStatus: {
        type: String,
        enum: ["with_seller", "with_delivery_boy", "in_transit", "delivered"],
        default: "with_seller"
    },
    currentHolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    damageReported: {
        type: Boolean,
        default: false
    },
    damageDetails: {
        reportedAt: String,  // "seller_handoff" | "delivery_pickup" | "delivered"
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        description: String,
        photos: [String]
    }
}, {
    timestamps: true

})

const QRTracking = mongoose.model("qrtrackings", qrTrackingSchema)
module.exports = QRTracking

