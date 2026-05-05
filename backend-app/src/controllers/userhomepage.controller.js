const express = require('express')
const mongoose = require("mongoose")
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

async function getProduct(req,res) {
    try {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID format"
            })
        }

        const product = await productModel.findById(id)

        console.log(product)

        if (!product) {
            return res.status(404).json ({
                message: "Can't find the product"
            })
        }

        res.status(201).json({
            message: "Product fetch successfully",
            product: product
        })
    } catch (err) {
        res.status(500).json({
            message: "Some error occured "
        })
    }
}

module.exports = {userHomepage,getProduct}