const Product = require("../models/product.model");

// Add a new product
async function addProduct(req, res) {
    try {
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ message: "Only sellers can add products" });
        }

        const { title, description, price, stock, fulfillmentType, category } = req.body;

        // Construct image URLs from uploaded files
        let protocol = req.protocol;
        if (req.get('host').includes('onrender.com')) protocol = 'https';
        const backendUrl = `${protocol}://${req.get('host')}`;
        const imageUrls = req.files ? req.files.map(file => `${backendUrl}/uploads/${file.filename}`) : [];

        const newProduct = new Product({
            sellerId: req.user._id,
            title,
            description,
            price,
            stock,
            fulfillmentType,
            category,
            images: imageUrls
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// Get products for the logged in seller
async function getMyProducts(req, res) {
    try {
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ message: "Only sellers can view their products" });
        }

        const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

module.exports = { addProduct, getMyProducts };
