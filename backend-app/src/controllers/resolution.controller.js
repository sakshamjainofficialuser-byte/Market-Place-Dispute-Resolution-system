const resolutionModel = require("../models/resolution.model")
const DisputeModel = require("../models/Dispute.model")

async function resolution(req,res) {
    const data = req.body;

    console.log(data)
    
    const disputeObj = await DisputeModel.findOne({disputeId})
}