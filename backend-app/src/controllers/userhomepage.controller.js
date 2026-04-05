const express = require('express')
const productModel = require("../models/product.model")

async function userHomepage(req,res) {
    try {
        const products = await productModel.find()

        res.status(200).json({
            message: "data fetched successfully",
            products: products
        })
    } catch(err) {
        res.status(500).send({
            message: `Error Occured: ${err}`
        })
    }
}

module.exports = userHomepage