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
        default: 1,
        min: [1, 'Quantity cannot be less than 1'],
    },
    
    brand: {
        type: String,
        required: true,
    },
    color: [{
        type: String,
        required: true,
    }],
    productImages: [{
        type: String,
        required: true,
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    numRatings: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    category: [{ type:String, ref: 'Category', required: true }],

    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }]
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
