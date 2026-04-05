const userDataModel = require("../models/userData.model") 

async function registerUser(req,res) {

<<<<<<< HEAD
    const userdata = req.body 
=======
    try {
    const userdata = req.body
>>>>>>> 186c96840a0cb11332002838657ab9231f0a8285

    const isUserExist = await userDataModel.findOne(
    {$or: [ 
        {username: userdata.name},
        {email: userdata.email}
    ]}) 

    if (isUserExist) {
        return res.status(409).send({ message: "User already exist" }) // ← add return
    } 
    
    const user = await userDataModel.create({
        username: userdata.name,
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
<<<<<<< HEAD
    
module.exports = {register} 
=======


async function registerSeller(req,res) {

    try {
    const sellerdata = req.body

    const isSellerExist = await userDataModel.findOne({
        $or: [ 
            {username: sellerdata.name},
            {email: sellerdata.email}
        ]
    })

    if (isSellerExist) {
        return res.status(409).send({ message: "Seller already exist" }) 
    }

    const seller = await userDataModel.create({
        username: sellerdata.name,
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
>>>>>>> 186c96840a0cb11332002838657ab9231f0a8285
