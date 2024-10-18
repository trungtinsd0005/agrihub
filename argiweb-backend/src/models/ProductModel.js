const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        image: { type: String, required: true },
        additionalImages: [{ type: String }],
        rating: { type: Number, default: 0.0, min: 0.0, max: 5.0 },
        description: { type: String },
        selled: {type: Number, default: 0},
        discount: {type: Number, default: 0},
        origin: { type: String },
        productionDate: { type: String },
        expirationDate: { type: String },
        ingredients: { type: String },
        usageInstructions: { type: String },
        storageInstructions: { type: String },
        weightProduct: { type: String },
    },
    {
        timestamps: true
    }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;