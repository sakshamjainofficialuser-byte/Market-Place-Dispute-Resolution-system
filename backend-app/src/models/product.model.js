const mongoose =  require("mongoose");

const productSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",        
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [1, "Price must be greater than 0"]
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    fulfillmentType: {
        type: String,
        required: true,
        enum: ["FBA", "FBM"]   
    },
    images: {
        type: [String],        
        default: []
    },
    category: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
},
{
    timestamps: true
})

const Product = mongoose.model("products", productSchema)
module.exports = Product
