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
 
module.exports = placeOrder