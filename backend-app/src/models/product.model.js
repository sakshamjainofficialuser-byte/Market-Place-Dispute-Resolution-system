import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    }
})

const productModel = mongoose.model("product",productSchema)

model.exports = productModel