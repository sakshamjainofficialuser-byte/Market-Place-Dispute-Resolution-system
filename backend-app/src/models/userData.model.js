const mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
})

const userDataModel = mongoose.model("users",userDataSchema)

module.exports = userDataModel