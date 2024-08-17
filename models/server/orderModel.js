const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalDiscountPrice: {
        type: Number,
        required: true
    },
    totalItem: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    paymentDetails: {
        paymentMethod: String,
        transactionId: String,
        paymentId: String,
        paymentStatus: String
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'PENDING'
    },
    createAd: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
