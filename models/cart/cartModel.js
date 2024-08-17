const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },
  cartItem:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartItem'
  }]
  ,
 
  createdAt: {
      type: Date,
      default: Date.now,
  },
});


const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
