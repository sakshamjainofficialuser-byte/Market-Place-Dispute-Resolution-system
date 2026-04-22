const Order = require("../models/order.model");
const Product = require("../models/product.model");
const OrderItem = require("../models/orderItem.model")

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
        // get all orders for logged-in buyer
        const orders = await Order.find({ buyerId: req.user._id })
            .sort({ createdAt: -1 })  // newest first

        // for each order, get its items
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await OrderItem.find({ orderId: order._id })
                    .populate("productId", "title images price")
                    .populate("sellerId", "username storeName")
        
                console.log(items)
                return {
                    _id: order._id,
                    status: order.status,
                    totalAmount: order.totalAmount,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
                    items: items
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

module.exports = { placeOrder, getMyOrders }