const OrderItem = require("../models/orderItem.model")
const User = require("../models/userData.model")
const Order = require("../models/order.model")

// Assign delivery boy to specific order item
async function assignDeliveryBoy(req, res) {
    try {
        const { orderItemId, deliveryBoyId } = req.body

        const orderItem = await OrderItem.findById(orderItemId)
            .populate("sellerId", "campusProfile")

        orderItem.assignedDeliveryBoy = deliveryBoyId
        orderItem.deliveryStatus = "assigned"
        
        // Set pickup location from seller
        orderItem.pickupLocation = {
            hostel: orderItem.sellerId?.campusProfile?.hostel,
            landmark: orderItem.sellerId?.campusProfile?.hostel,
            sellerPhone: orderItem.sellerId?.phoneNumber
        }
        
        await orderItem.save()

        const deliveryBoy = await User.findById(deliveryBoyId)
        if (!deliveryBoy.deliveryProfile.activeOrders) {
            deliveryBoy.deliveryProfile.activeOrders = [];
        }
        deliveryBoy.deliveryProfile.activeOrders.push(orderItemId)
        await deliveryBoy.save()

        res.status(200).json({
            message: "Delivery boy assigned",
            orderItem
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Get all pending items needing delivery assignment
async function getPendingDeliveryItems(req, res) {
    try {
        const pendingItems = await OrderItem.find({ 
            deliveryStatus: "pending" 
        })
        .populate("productId", "title images")
        .populate("sellerId", "username campusProfile phoneNumber")
        .populate("orderId", "buyerId")

        const itemsWithBuyer = await Promise.all(
            pendingItems.map(async (item) => {
                const order = await Order.findById(item.orderId)
                    .populate("buyerId", "username campusProfile phoneNumber")
                
                return {
                    ...item.toObject(),
                    buyerInfo: order.buyerId
                }
            })
        )

        res.status(200).json({
            message: "Pending items fetched",
            items: itemsWithBuyer
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Get available delivery boys
async function getAvailableDeliveryBoys(req, res) {
    try {
        const deliveryBoys = await User.find({ 
            role: "delivery_boy"
        }) // In a real app we might check "deliveryProfile.verified" but we will just fetch all for now to avoid issues since the dummy data might not have it.

        res.status(200).json({
            message: "Delivery boys fetched",
            deliveryBoys
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { 
    assignDeliveryBoy,
    getPendingDeliveryItems,
    getAvailableDeliveryBoys
}
