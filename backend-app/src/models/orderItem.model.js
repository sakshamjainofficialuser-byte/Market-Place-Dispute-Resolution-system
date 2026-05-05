const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtPurchase: {
        type: Number,
        required: true
    },
    
    // NEW: Delivery tracking per item
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    deliveryStatus: {
        type: String,
        enum: ["pending", "assigned", "picked_up", "in_transit", "delivered"],
        default: "pending"
    },
    pickupLocation: {
        hostel: String,
        landmark: String,
        sellerPhone: String
    },
    deliveryLocation: {
        hostel: String,
        landmark: String,
        buyerPhone: String
    },
    qrTrackingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "qrtrackings"
    }
}, {
    timestamps: true
})

const OrderItem = mongoose.model("orderItems", orderItemSchema)
module.exports = OrderItem