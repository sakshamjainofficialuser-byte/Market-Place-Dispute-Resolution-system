const userDataModel = require("../models/userData.model") 

async function registerUser(req,res) {
    const userdata = req.body
    console.log(userdata)
    try {

    const isUserExist = await userDataModel.findOne(
    {$or: [ 
        {username: userdata.username},
        {email: userdata.email}
    ]}) 

    if (isUserExist) {
        return res.status(409).send({ message: "User already exist" }) // ← add return
    } 
    
    const user = await userDataModel.create({
        username: userdata.username,
        email: userdata.email,
        password: userdata.password,
        role: userdata.role
    })

    const token = user.generateToken()

    if (user) {
        console.log(user)
        res.status(200).json({message:"user created successfully",token})
        console.log(user)
    }
} catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message })
}
}


async function registerSeller(req,res) {

    try {
    const sellerdata = req.body

    const isSellerExist = await userDataModel.findOne({
        $and: [ 
            {username: sellerdata.username},
            {email: sellerdata.email}
        ]
    })

    if (isSellerExist) {
        return res.status(409).send({ message: "Seller already exist" }) 
    }

    const seller = await userDataModel.create({
        username: sellerdata.username,
        email: sellerdata.email,
        password: sellerdata.password,
        role: "seller"
    })

    const token = seller.generateToken()

    if (seller) {
        console.log(seller)
        res.status(200).json({message:"user created successfully",token})
    }
} catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message })
}
}
    


module.exports = {registerUser,registerSeller}
