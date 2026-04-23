const jwt = require("jsonwebtoken")

function verifyToken(req,res,next) {
    
    console.log(`DEBUG: Cookies received for ${req.originalUrl}:`, req.cookies);
    const token = req.cookies.token
    
    if (!token) {
        console.log("DEBUG: ❌ No token found in cookies. All cookies keys:", Object.keys(req.cookies || {}));
        return res.status(401).json({ message: "BACKEND_ERR: NO_TOKEN_IN_COOKIES" })
    } try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded  
        console.log("DEBUG: ✅ Token OK for:", req.user.username || req.user.name)
        next()
    } catch (err) {
        console.log("DEBUG: ❌ Token Invalid:", err.message)
        res.status(401).json({
            message: "BACKEND_ERR: INVALID_TOKEN"
        })
    }
}

module.exports = verifyToken