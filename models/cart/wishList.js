const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({

product:[ {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  required: true
}],
  quantity: {
    type: Number,
 
    default: 1
  },
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

const wishList = mongoose.model("wishList", wishListSchema);

module.exports = wishList;
