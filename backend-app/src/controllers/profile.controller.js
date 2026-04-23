const userDataModel = require("../models/userData.model")
const Order = require("../models/order.model")

// ─── Get logged-in user's profile ─────────────────────────────────────────────
async function getMyProfile(req, res) {
    try {
        // req.user._id comes from verifyToken middleware
        const user = await userDataModel.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Calculate order stats
        const orders = await Order.find({ buyerId: req.user._id })
        const totalOrders = orders.length
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

        res.status(200).json({
            message: "Profile fetched",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                memberSince: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                    : "N/A"
            },
            stats: {
                totalOrders,
                totalSpent
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { getMyProfile }
