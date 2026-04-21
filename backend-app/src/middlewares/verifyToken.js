const jwt = require("jsonwebtoken")

function verifyToken(req,res,next) {
    
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Please login first" })
    } try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded  
        console.log(req.user)
        next()
    } catch (err) {
        res.status(401).json({
            message:"Invalid Token"
        })
    }
}

module.exports = verifyToken