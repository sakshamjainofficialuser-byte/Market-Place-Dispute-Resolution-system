const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "pending"],
        default: "pending"
    },
    // ADD these fields
assignedDeliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
},
deliveryStatus: {
    type: String,
    enum: ["pending_assignment", "assigned", "picked_up", "in_transit", "delivered"],
    default: "pending_assignment"
},
estimatedDelivery: Date,

// QR Code reference
qrTrackingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "qrtrackings"
}
}, {
    timestamps: true
})

const Order = mongoose.model("orders",orderSchema)

module.exports = Order