const express = require("express");
const { addProduct, getMyProducts } = require("../controllers/product.controller");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../config.js/multer.config");

const productRoute = express.Router();

// Seller: add a new product (with image uploads)
productRoute.post("/add", verifyToken, upload.array("images", 5), addProduct);

// Seller: get their own products
productRoute.get("/my-products", verifyToken, getMyProducts);

module.exports = productRoute;
