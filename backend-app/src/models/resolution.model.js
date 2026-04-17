const mongoose = require("mongoose");

const resolutionSchema = new mongoose.Schema({

    disputeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },

    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    decision : {
        type : String,
        required : true,
        trim : true,
        enum: ["Rejected","Refund","Replacement"]
    },

    note : {
        type : String,
        trim: true,
        required : true
    }
},{
    timestamp : true
});

const resolutionModel = mongoose.model("resolutions",resolutionSchema);
module.exports = resolutionModel