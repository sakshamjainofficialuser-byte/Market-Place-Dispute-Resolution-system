const userDataModel = require("../models/userData.model");

async function loginUser(req, res) {
    try {
        const { username, password } = req.body
        console.log(username, password)


        const user = await userDataModel.findOne({
            $and: [{ username: username }, { password: password }]
        })
        console.log(!user)

        if (!user) {
            return res.json({
                message: "User not found."
            })
        } else {
            console.log(user)
        }

        const token = user.generateToken()


        const isProduction = process.env.NODE_ENV === "production" || req.hostname !== "localhost";

        res.status(201).cookie(
            "token", token, {
            httpOnly: true,
            secure: isProduction, // True for HTTPS (production), False for HTTP (localhost)
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        }
        ).json({
            message: "User Logged In",
            user: user,
            token: token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

async function loginSeller(req, res) {
    try {
        const { username, password } = req.body;

        console.log(username, password)

        const seller = await userDataModel.findOne({ $and: [{ username: username }, { password: password }] })

        if (!seller) {
            return res.json({
                message: "Seller does not exist!"
            })
        }
        console.log("seller:::", seller)
        const token = await seller.generateToken()

        const isProduction = process.env.NODE_ENV === "production" || req.hostname !== "localhost";

        res.status(201).cookie(
            "token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        }
        ).json({
            message: "Seller Logged In",
            name: seller.username,
            role: seller.role,
            token: token
        })

    } catch (err) {
        res.status(500).json(
            { message: "Somthing goes wrong", }
        )
    }
}

module.exports = { loginUser, loginSeller }