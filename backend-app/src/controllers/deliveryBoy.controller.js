const Order = require("../models/order.model")
const OrderItem = require("../models/orderItem.model")
const QRTracking = require("../models/qrTracking.model")
const User = require("../models/userData.model")

// Get assigned delivery items (not orders!)
async function getMyDeliveries(req, res) {
    try {
        const deliveryBoyId = req.user._id

        const assignedItems = await OrderItem.find({
            assignedDeliveryBoy: deliveryBoyId,
            deliveryStatus: { $in: ["assigned", "picked_up", "in_transit"] }
        })
            .populate("productId", "title images")
            .populate("sellerId", "username")
            .sort({ createdAt: -1 })


        const itemsWithDetails = await Promise.all(
            assignedItems.map(async (item) => {

                const order = await Order.findById(item.orderId)
                    .populate("buyerId", "username")

                const tracking = await QRTracking.findOne({ orderItemId: item._id })

                return {
                    ...item.toObject(),
                    orderId: order, // Provide the full order object
                    buyerInfo: order.buyerId,
                    tracking
                }

            })
        )

        // Fetch the delivery boy's own profile stats
        const deliveryBoy = await User.findById(deliveryBoyId).select("deliveryProfile")

        res.status(200).json({
            message: "Delivery items fetched",
            deliveryItems: itemsWithDetails,
            profile: deliveryBoy.deliveryProfile
        })


    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Accept delivery item assignment
async function acceptDelivery(req, res) {
    try {
        const { orderItemId } = req.body
        const deliveryBoyId = req.user._id

        const orderItem = await OrderItem.findById(orderItemId)
        orderItem.assignedDeliveryBoy = deliveryBoyId
        orderItem.deliveryStatus = "assigned"
        await orderItem.save()

        const deliveryBoy = await User.findById(deliveryBoyId)
        deliveryBoy.deliveryProfile.activeOrders.push(orderItemId)
        await deliveryBoy.save()

        res.status(200).json({
            message: "Delivery accepted",
            orderItem
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Mark item delivery complete
async function completeDelivery(req, res) {
    try {
        const { orderItemId } = req.body
        const deliveryBoyId = req.user._id

        const orderItem = await OrderItem.findById(orderItemId)
        orderItem.deliveryStatus = "delivered"
        await orderItem.save()

        // Check if all items in order are delivered
        const allItems = await OrderItem.find({ orderId: orderItem.orderId })
        const allDelivered = allItems.every(item => item.deliveryStatus === "delivered")

        if (allDelivered) {
            const order = await Order.findById(orderItem.orderId)
            order.status = "delivered"
            await order.save()
        }

        const deliveryBoy = await User.findById(deliveryBoyId)
        deliveryBoy.deliveryProfile.stats.totalDeliveries += 1
        deliveryBoy.deliveryProfile.stats.successfulDeliveries += 1
        deliveryBoy.deliveryProfile.activeOrders =
            deliveryBoy.deliveryProfile.activeOrders.filter(
                id => id.toString() !== orderItemId.toString()
            )
        await deliveryBoy.save()

        res.status(200).json({
            message: "Delivery completed",
            orderItem
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = {
    getMyDeliveries,
    acceptDelivery,
    completeDelivery
}
