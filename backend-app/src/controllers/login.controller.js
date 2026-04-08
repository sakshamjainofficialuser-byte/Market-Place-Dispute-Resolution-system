const userDataModel = require("../models/userData.model");
 
async function loginUser(req,res) {
    try{
    const {username,password} = req.body
    console.log(req.body)

    const user = await userDataModel.findOne({
        $and : [{username:username},{password:password}]
    })
    console.log(!user)

    if (!user) {
        return res.json({
            message: "User not found."
    })} else {
        console.log(user)
    }

    const token = user.generateToken()

    res.status(201).cookie(
        "token",token, {
            httpOnly: true,
            secure: true
        }
    ).json({
        message: "User Logged In",
        name: user.name,
        role: user.role,
        token: token
    })
} catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message })
}
}

// async function loginSeller(req,res) {
//     try {
//     }
// }

module.exports = {loginUser}