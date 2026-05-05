const express = require('express');
const OrderRoute = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const {getMyOrders, placeOrder, getSellerOrders} = require('../controllers/order.controller');

OrderRoute.post("/order",verifyToken,placeOrder)
OrderRoute.get("/my-orders", verifyToken, getMyOrders)
OrderRoute.get("/seller-orders", verifyToken, getSellerOrders)


module.exports = OrderRoute