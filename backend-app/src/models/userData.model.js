const mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
    username: {
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
        required: true
    },
})

const userDataModel = mongoose.model("users",userDataSchema)

module.exports = userDataModel 