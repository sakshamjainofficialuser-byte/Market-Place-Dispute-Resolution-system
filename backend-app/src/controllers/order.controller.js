const Order = require("../models/order.model");
const Product = require("../models/product.model");
const OrderItem = require("../models/orderItem.model")
const QRTracking = require("../models/qrTracking.model")
const QRCode = require("qrcode")


async function placeOrder(req,res) {
    
    try {
        const { items } = req.body
        console.log(items)

        let totalAmount = 0
        for (let item of items ) {
            const product = await Product.findById(item.productId)
            totalAmount = totalAmount + product.price * item.quantity 
        }

        let order = await Order.create({
            buyerId: req.user._id,  
            totalAmount,
            paymentStatus: "paid"
        })

        console.log(order)
        for (let item of items) {
            const product = await Product.findById(item.productId)
            await OrderItem.create({
                orderId: order._id,
                productId: item.productId,
                sellerId: product.sellerId,
                quantity: item.quantity,
                priceAtPurchase: product.price
            })
        }

        res.status(201).json({
            message: "Order placed successfully.",
            order,
        })

        // ✅ AUTO-GENERATE QR CODES FOR ALL ITEMS
        try {
            const orderItems = await OrderItem.find({ orderId: order._id })
            for (let item of orderItems) {
                const qrData = JSON.stringify({
                    orderItemId: item._id.toString(),
                    orderId: order._id.toString(),
                    productId: item.productId.toString(),
                    timestamp: Date.now()
                })

                const qrCodeImage = await QRCode.toDataURL(qrData, { width: 300 })

                await QRTracking.create({
                    orderId: order._id,
                    orderItemId: item._id,
                    productId: item.productId,
                    qrCode: qrData,
                    qrCodeImageUrl: qrCodeImage,
                    currentStatus: "with_seller",
                    currentHolder: item.sellerId,
                    timeline: [{
                        stage: "seller_handoff",
                        timestamp: new Date(),
                        scannedBy: req.user._id, // buyer who placed order
                        notes: "Order placed, QR generated"
                    }]

                })
            }
            console.log("DEBUG: QR Codes auto-generated for order:", order._id)
        } catch (qrErr) {
            console.error("ERROR: Failed to auto-generate QR codes:", qrErr)
        }


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}
 
async function getMyOrders(req, res) {
    try {
        const Dispute = require("../models/Dispute.model")

        // get all orders for logged-in buyer
        const orders = await Order.find({ buyerId: req.user._id })
            .sort({ createdAt: -1 })  // newest first

        // for each order, get its items
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await OrderItem.find({ orderId: order._id })
                    .populate("productId", "title images price")
                    .populate("sellerId", "username storeName")
        
                // Check each item for disputes
                const itemsWithDisputeCheck = await Promise.all(items.map(async (item) => {
                    const dispute = await Dispute.findOne({ orderItemId: item._id })
                    return {
                        ...item.toObject(),
                        disputeRaised: !!dispute
                    }
                }))

                return {
                    _id: order._id,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
                    items: itemsWithDisputeCheck
                }
            })
        )

        res.status(200).json({
            message: "Orders fetched",
            orders: ordersWithItems
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

async function getSellerOrders(req, res) {
    try {
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ message: "Access denied" })
        }

        // Find all OrderItems belonging to this seller
        const orderItems = await OrderItem.find({ sellerId: req.user._id })
            .populate("productId", "title images price")
            .populate("assignedDeliveryBoy", "username phoneNumber")
            .populate("orderId", "buyerId createdAt status totalAmount")
            .populate({
                path: "orderId",
                populate: { path: "buyerId", select: "username email" }
            })
            .sort({ createdAt: -1 })


        // The frontend expects a list of "orders"
        const transformedOrders = await Promise.all(orderItems.map(async (item) => {
            let qrRecord = await QRTracking.findOne({ orderItemId: item._id })
            
            // ✅ SELF-HEALING: If QR is missing (e.g. order placed before auto-gen fix), generate it now
            if (!qrRecord) {
                try {
                    const qrData = JSON.stringify({
                        orderItemId: item._id.toString(),
                        orderId: (item.orderId?._id || item.orderId).toString(),
                        productId: (item.productId?._id || item.productId).toString(),
                        timestamp: Date.now()
                    })
                    const qrCodeImage = await QRCode.toDataURL(qrData, { width: 300 })
                    qrRecord = await QRTracking.create({
                        orderId: item.orderId?._id || item.orderId,
                        orderItemId: item._id,
                        productId: item.productId?._id || item.productId,
                        qrCode: qrData,
                        qrCodeImageUrl: qrCodeImage,
                        currentStatus: "with_seller",
                        currentHolder: item.sellerId,
                        timeline: [{
                            stage: "seller_handoff",
                            timestamp: new Date(),
                            scannedBy: item.orderId?.buyerId?._id || item.orderId?.buyerId || item.sellerId,
                            notes: "QR auto-generated on view"
                        }]
                    })

                    console.log(`DEBUG: Self-healed QR for item ${item._id}`)
                } catch (qrErr) {
                    console.error("ERROR: Failed to self-heal QR:", qrErr)
                }
            }

            return {
                _id: item._id, // use OrderItem ID as the unique key
                orderId: item.orderId?._id,
                buyerId: item.orderId?.buyerId,
                status: item.deliveryStatus || "pending",
                totalAmount: item.priceAtPurchase * item.quantity,
                createdAt: item.createdAt,
                productId: item.productId,
                quantity: item.quantity,
                qrCode: qrRecord ? qrRecord.qrCodeImageUrl : null,
                deliveryBoy: item.assignedDeliveryBoy
            }
        }))




        res.status(200).json({
            message: "Seller orders fetched",
            orders: transformedOrders
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { placeOrder, getMyOrders, getSellerOrders }