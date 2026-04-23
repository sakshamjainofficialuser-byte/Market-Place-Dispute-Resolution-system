const Product = require("../models/product.model")

// ─── Get all categories (unique categories from products, with their products) ─
async function getCategories(req, res) {
    try {
        // Get all unique category names
        const categoryNames = await Product.distinct("category")

        // For each category, fetch its products
        const categories = await Promise.all(
            categoryNames
                .filter(Boolean)  // remove null/empty
                .map(async (name) => {
                    const products = await Product.find({ category: name, status: "active" })
                        .select("_id title price images fulfillmentType")
                        .limit(20)
                    return { name, products }
                })
        )

        res.status(200).json({
            message: "Categories fetched",
            categories
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
}

module.exports = { getCategories }
