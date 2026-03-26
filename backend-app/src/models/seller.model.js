const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    gstnumber: {
        type: String,
        required: true,
        unique: true
    }
})

const sellerModel = mongoose.model("seller",sellerSchema)

module.exports = sellerModel