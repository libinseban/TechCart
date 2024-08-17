const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  },cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;
