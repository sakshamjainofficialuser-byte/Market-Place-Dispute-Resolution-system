const express = require('express');
const OrderRoute = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const {getMyOrders} = require('../controllers/order.controller');
const {placeOrder} = require('../controllers/order.controller');

OrderRoute.post("/order",verifyToken,placeOrder)
OrderRoute.get("/my-orders", verifyToken, getMyOrders)

module.exports = OrderRoute