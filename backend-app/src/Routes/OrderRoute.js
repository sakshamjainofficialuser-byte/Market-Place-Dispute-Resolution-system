const express = require('express');
const OrderRoute = express.Router();
const verifyToken = require("../middlewares/verifyToken")
const placeOrder = require('../controllers/order.controller');

OrderRoute.post("/order",verifyToken,placeOrder)

module.exports = OrderRoute