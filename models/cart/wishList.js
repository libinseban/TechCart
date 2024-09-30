const mongoose = require('mongoose');
const Product = require('../server/productModel');

const wishListSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  price: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const wishList = mongoose.model("WishList", wishListSchema); 

module.exports = wishList;
