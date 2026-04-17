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
    }
}, {
    timestamps: true
})

const OrderItem = mongoose.model("orderitems", orderItemSchema)
module.exports = OrderItem