const Dispute = require("../models/Dispute.model")
const Product = require("../models/product.model")
const OrderItem = require("../models/orderItem.model")
const Order = require("../models/order.model")

async function raiseDispute(req,res) {
    // taking the orderitem 
    // taking the order 
    try {
        const data = req.body

    const orderItem = await OrderItem.findById(data.orderItemId)
    const product = await Product.findById(orderItem.productId)
    const order = await Order.findById(orderItem.orderId)

    const dispute = await Dispute.create({
        orderItemId: orderItem._id,
        buyerId: order.buyerId,
        sellerId: orderItem.sellerId,
        reason: data.reason,
        fulfillmentType: product.fulfillmentType,
    })

    res.status(201).json({
        message: "Issue Raised Successfully.",
        dispute
    })
    } catch (err) {
        res.status(500).json({
            mesaage: "Some error occured",
            error: err
        })
    }
}

module.exports = raiseDispute