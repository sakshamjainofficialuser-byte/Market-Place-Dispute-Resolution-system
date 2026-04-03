const mongoose = require("mongoose")
const dbURI = process.env.MONGO_URI


async function connectDB() {
    try {
        await mongoose.connect(dbURI)
        console.log("Connected to DB")
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1)
    }
}   

module.exports = connectDB 