const userDataModel = require("../models/userData.model");
 
async function loginUser(req,res) {
    try{
    const {email,password} = req.body

    const user = await userDataModel.findOne({
        $and : [{email},{password}]
    })

    if (!user) {
        return res.status(409).json({
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

module.exports = {loginUser}