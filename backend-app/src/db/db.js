const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://sakshamjainofficialuser_db_user:asWZxCRE2qf5pSis@marketplace-cluster.c8x0zbc.mongodb.net/marketplace")
        console.log("Connected to DB")
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1)
    }
}

module.exports = connectDB