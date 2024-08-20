const mongoose = require('mongoose');
const Category = require('../cart/category'); 


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
 
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    discountPercentage: { 
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    color: [{
        type: String,
        required: true,
    }],
    imageUrl: {
        type: String,
        required: true,
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "rating",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
    }],
    numRatings: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    category: [{ type: String, required:true }], 
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
