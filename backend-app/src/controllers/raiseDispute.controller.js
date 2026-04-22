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
        orderId: order._id,
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


async function getAllDisputes(req, res) {
    try {
        // populate fills in the full details instead of just IDs
        const disputes = await Dispute.find()
            .populate("buyerId", "username email")
            .populate("sellerId", "username email storeName")
            .populate("orderId")
            .sort({ createdAt: -1 })  // newest first

        res.status(200).json({
            message: "Disputes fetched successfully",
            disputes
        })

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

async function getDisputeDetails(req, res) {
    try {
        const { disputeId } = req.params

        const dispute = await Dispute.findById(disputeId)
            .populate("buyerId", "username email")
            .populate("sellerId", "username email storeName")
            .populate("orderId")
            .populate("adminId", "username")

        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" })
        }

        // get all evidence for this dispute
        const evidence = await Evidence.find({ disputeId: disputeId })

        // get resolution if exists
        const resolution = await Resolution.findOne({ disputeId: disputeId })
            .populate("resolvedBy", "username")

        res.status(200).json({
            message: "Dispute details fetched",
            dispute,
            evidence,
            resolution
        })

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}

module.exports = { raiseDispute, getAllDisputes, getDisputeDetails }