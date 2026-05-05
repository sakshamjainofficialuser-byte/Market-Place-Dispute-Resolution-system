require('dotenv').config();
const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "seller", "admin", "delivery_boy"], default: "user" }
});

const User = mongoose.model('users', userDataSchema);


async function createDeliveryBoy() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ username: "delivery" });
        if (existing) {
            console.log("Delivery boy already exists");
        } else {
            await User.create({
                username: "delivery",
                email: "delivery@example.com",
                password: "123",
                role: "delivery_boy"
            });
            console.log("Delivery boy account created: delivery / 123");
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createDeliveryBoy();
