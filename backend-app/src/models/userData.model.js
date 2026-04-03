<<<<<<< HEAD
const mongoose = require("mongoose") 
const jwt = require('json-web-token') 
require("dotenv").config() 
=======
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
require("dotenv").config()
>>>>>>> 186c96840a0cb11332002838657ab9231f0a8285

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
        enum: ["buyer", "seller","admin"],
        default: "buyer"
    }
})

userDataSchema.methods.generateToken = function() {
    return jwt.sign({
        _id: this._id,
        name: this.username,
        email: this.email
    }, process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
)}

<<<<<<< HEAD


=======
 
>>>>>>> 186c96840a0cb11332002838657ab9231f0a8285
const userDataModel = mongoose.model("users",userDataSchema)

module.exports = userDataModel 