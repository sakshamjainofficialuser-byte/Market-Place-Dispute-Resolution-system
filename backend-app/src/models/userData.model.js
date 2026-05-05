const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
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
        enum: ["user", "seller", "admin", "delivery_boy"],
        default: "user"
    },
    phoneNumber: {
        type: String
    },
    campusProfile: {
        hostel: String
    },
    deliveryProfile: {
        vehicleType: {
            type: String,
            enum: ["bike", "bicycle", "scooter", "car"]
        },
        vehicleNumber: String,
        verified: { type: Boolean, default: false },
        activeOrders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderItems"
        }],
        stats: {
            totalDeliveries: { type: Number, default: 0 },
            successfulDeliveries: { type: Number, default: 0 },
            damageReported: { type: Number, default: 0 },
            rating: { type: Number, default: 5, min: 1, max: 5 }
        }
    }
})

userDataSchema.methods.generateToken = function() {
    return jwt.sign({
        _id: this._id,
        name: this.username,
        email: this.email,
        role: this.role   // ✅ needed for isAdmin middleware
    }, process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
)}



const userDataModel = mongoose.models.users || mongoose.model("users",userDataSchema)

module.exports = userDataModel 