const QRCode = require('qrcode')
const QRTracking = require('../models/qrTracking.model')
const Order = require('../models/order.model')
const OrderItem = require('../models/orderItem.model')

// Generate QR Code when order is placed
async function generateQRForOrder(req, res) {
    try {
        const { orderId } = req.body

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Get all order items
        const orderItems = await OrderItem.find({ orderId: order._id })
        console.log(orderItems)

        const qrRecords = []

        // Generate QR for each item
        for (let item of orderItems) {
            // ✅ Check if QR already exists for this item
            let tracking = await QRTracking.findOne({ orderItemId: item._id })

            if (!tracking) {
                // Create unique identifier
                const qrData = JSON.stringify({
                    orderItemId: item._id.toString(),
                    orderId: order._id.toString(),
                    productId: item.productId.toString(),
                    timestamp: Date.now()
                })

                const qrString = qrData

                // Generate QR code image (base64)
                const qrCodeImage = await QRCode.toDataURL(qrString, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                })

                // Create tracking record
                tracking = await QRTracking.create({
                    orderId: order._id,
                    orderItemId: item._id,
                    productId: item.productId,
                    qrCode: qrString,
                    qrCodeImageUrl: qrCodeImage,
                    currentStatus: "with_seller",
                    currentHolder: item.sellerId,
                    timeline: [{
                        stage: "seller_handoff",
                        timestamp: new Date(),
                        scannedBy: item.sellerId,
                        notes: "QR Code generated, awaiting seller handoff"
                    }]
                })
            }

            qrRecords.push({
                orderItemId: item._id,
                qrCode: tracking.qrCodeImageUrl, // Use the stored image
                trackingId: tracking._id
            })
        }


        res.status(201).json({
            message: "QR codes generated",
            qrCodes: qrRecords
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Scan QR Code and update tracking
async function scanQRCode(req, res) {
    try {
        const { qrData, notes, location } = req.body

        // ✅ REQUIRE PHOTOS: uploaded via multer (req.files) 
        const uploadedFiles = req.files || []

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({
                message: "Visual evidence required. Please upload at least one photo of the product."
            })
        }

        // Build server-accessible URLs from uploaded disk paths
        const photoUrls = uploadedFiles.map(file => file.path.replace(/\\/g, "/"))

        // Parse QR data
        const parsedData = JSON.parse(qrData)
        const { orderItemId } = parsedData

        // Find tracking record
        const tracking = await QRTracking.findOne({ orderItemId })

        if (!tracking) {
            return res.status(404).json({ message: "QR tracking not found" })
        }

        // Determine stage based on current user role
        const user = req.user
        let stage = ""
        let newStatus = ""

        if (user.role === "delivery_boy") {
            if (tracking.currentStatus === "with_seller") {
                stage = "delivery_pickup"
                newStatus = "with_delivery_boy"
            } else if (tracking.currentStatus === "with_delivery_boy") {
                stage = "in_transit"
                newStatus = "in_transit"
            } else {
                return res.status(400).json({ message: `Invalid status for delivery boy: ${tracking.currentStatus}` })
            }
        } else if (user.role === "buyer" || user.role === "user") {
            if (tracking.currentStatus === "in_transit") {
                stage = "delivered"
                newStatus = "delivered"
            } else {
                return res.status(400).json({ message: "Product must be in transit before delivery can be confirmed." })
            }
        }

        if (!stage) {
            return res.status(400).json({ message: "Could not determine tracking stage." })
        }


        // Add to timeline with disk-saved photo paths
        tracking.timeline.push({
            stage,
            timestamp: new Date(),
            scannedBy: user._id,
            location,
            photos: photoUrls.map(url => ({
                url,
                uploadedBy: user._id,
                timestamp: new Date()
            })),
            notes
        })

        tracking.currentStatus = newStatus
        tracking.currentHolder = user._id

        await tracking.save()

        // Update order item status
        const orderItem = await OrderItem.findById(orderItemId)
        if (stage === "delivery_pickup") {
            orderItem.deliveryStatus = "picked_up"
        } else if (stage === "in_transit") {
            orderItem.deliveryStatus = "in_transit"
        } else if (stage === "delivered") {
            orderItem.deliveryStatus = "delivered"
        }
        await orderItem.save()

        // Check if all items in order are delivered
        await checkOrderCompletion(tracking.orderId)

        res.status(200).json({
            message: "QR scanned successfully",
            tracking,
            stage
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

// Check if all items delivered, update order status
async function checkOrderCompletion(orderId) {
    const allItems = await OrderItem.find({ orderId })
    const allDelivered = allItems.every(item => item.deliveryStatus === "delivered")
    const someDelivered = allItems.some(item => item.deliveryStatus === "delivered")

    const order = await Order.findById(orderId)

    if (allDelivered) {
        order.status = "delivered"
    } else if (someDelivered) {
        order.status = "partially_delivered"
    }

    await order.save()
}

// Get tracking timeline
async function getTrackingTimeline(req, res) {
    try {
        const { orderItemId } = req.params

        const tracking = await QRTracking.findOne({ orderItemId })
            .populate('timeline.scannedBy', 'username role')
            .populate('currentHolder', 'username role')

        if (!tracking) {
            return res.status(404).json({ message: "Tracking not found" })
        }

        res.status(200).json({
            message: "Tracking timeline fetched",
            tracking
        })

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = {
    generateQRForOrder,
    scanQRCode,
    getTrackingTimeline
}