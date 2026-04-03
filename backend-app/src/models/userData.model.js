const mongoose = require("mongoose") 
const jwt = require('json-web-token') 
require("dotenv").config() 

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

    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }
})

userDataSchema.methods.hashPassword = function() {

}

userDataSchema.methods.generateToken = function() {
    jwt.sign({
        _id: this._id,
        name: this.username,
        email: this.email
    }, process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
)}



const userDataModel = mongoose.model("users",userDataSchema)

module.exports = userDataModel 