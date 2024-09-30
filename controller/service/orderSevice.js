const Address = require("../../models/server/addressModel");
const Order = require("../../models/server/orderModel");
const User = require('../../models/client/userModel');
const Cart = require("../../models/cart/cartModel");
const Seller = require("../../models/client/seller");
const nodemailer = require('nodemailer');
const Product = require("../../models/server/productModel");
const Razorpay = require('razorpay');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD
  }
});

async function sendEmail( subject, text) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to:sellerEmail,
    subject,
    html: `<p>Dear Seller,</p><p>${text}</p><p>Best regards,<br>Your Company</p> ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



const createOrder = async (userId, shippingAddress) => {
  try {
    let address;
    if (shippingAddress._id) {
      address = await Address.findById(shippingAddress._id);
    }

    if (!address) {
      const requiredFields = ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          throw new Error(`Missing required address field: ${field}`);
        }
      }

      address = new Address({
        user: userId,
        ...shippingAddress
      });

      await address.save();

      await User.findByIdAndUpdate(userId, {
        $push: { address: address._id }
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'cartItem',
      populate: {
        path: 'product',
        select: 'price discountPrice'
      }
    });

    console.log('Retrieved cart:', cart);

    if (!cart || !cart.cartItem || !cart.cartItem.length) {
      throw new Error('Cart or CartItems not found');
    }

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    cart.cartItem.forEach(item => {
      totalPrice += (item.product.price * item.quantity) - item.product.discountPrice;
      totalDiscountPrice += item.product.discountPrice * item.quantity;
      totalItem += item.quantity;
    });

    const price = totalPrice - totalDiscountPrice;
    const products = cart.cartItem.map(item => item.product._id);

    const paymentCapture = 1; 
    const razorpayOptions = {
      amount: price * 100, 
      currency: "INR",
      receipt: `order_rcptid_${new Date().getTime()}`, 
      payment_capture: paymentCapture
    };

    const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
    console.log('Razorpay order created:', razorpayOrder);

    const order = new Order({
      user: userId,
      orderDate: new Date(),
      address: address._id,
      totalPrice,
      totalDiscountPrice,
      totalItem,
      price,
      products,
      paymentId: razorpayOrder.id,  
      paymentStatus: 'Pending',    
    });

    await order.save();

    const updateResult = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { cartItem: [] } },
      { new: true }
    );

    console.log('Cart cleared:', updateResult);

    const sellers = new Set();
    cart.cartItem.forEach(item => {
      if (item.product.seller) {
        sellers.add(item.product.seller);
      }
    });

    for (const sellerId of sellers) {
      const seller = await Seller.findById(sellerId);
      if (seller && seller.email) {
        await sendEmail(
          seller.email,
          'New Order Placed',
          `A new order has been placed. Order ID: ${order._id}.`
        );
      }
    }

    return {
      message: 'Order placed successfully, awaiting payment',
      order,
      razorpayOrderId: razorpayOrder.id, 
      amount: price * 100,               
      currency: "INR"
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


async function confirmOrder(orderId) {
  try {
    const order = await findOrder(orderId);
    order.orderStatus = "CONFIRMED";
    return await order.save();
  } catch (error) {
    console.error("Error confirming order:", error);
    throw error;
  }
}

async function shipOrder(orderId) {
  try {
    const order = await findOrder(orderId);
    order.orderStatus = "SHIPPED";
    return await order.save();
  } catch (error) {
    console.error("Error shipping order:", error);
    throw error;
  }
}

async function deliverOrder(orderId) {
  try {
    const order = await findOrder(orderId);
    order.orderStatus = "DELIVERED";
    return await order.save();
  } catch (error) {
    console.error("Error delivering order:", error);
    throw error;
  }
}
const cancelOrder = async (req, res) => {
  const  {userId,productId}  = req.body;
  try {
    const orders = await findOrder(productId, userId);
    
    if (orders.length === 0) throw new Error('Order not found');
    
    const order = orders[0];
    
    await Order.findByIdAndUpdate(order.orderId, { orderStatus: "CANCELLED" });
    
    // Notify sellers
    for (const product of order.products) {
      const productDetails = await Product.findById(productId).populate('seller');
      
      if (productDetails && productDetails.seller && productDetails.seller.email) {
        const sellerEmail = productDetails.seller.email;
        const subject = `Order ${order.orderId} Cancelled`;
        const message = `Dear ${productDetails.seller.name}, the order containing your product has been cancelled by the user.`;

        await sendEmail(sellerEmail, subject, message);
      }
    }

    return res.status(200).send({ success: true, message: 'Order cancelled and sellers notified.' });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).send({ error: error.message });
  }
};

  
async function findOrder(productId, userId) {
  try {
    const orders = await Order.find({
      user: userId,
      orderStatus: { $in: ["PLACED", "PENDING"] }
    })
    .populate('products') 
    .lean();
    
    const orderStatuses = orders.map(order => ({
      orderId: order._id,
      products: order.products
        .filter(product => product._id.toString() === productId)
        .map(product => ({
          product: product,
          status: order.orderStatus,
          orderDate:order.createAd
        }))
    })).filter(order => order.products.length > 0); 
    return orderStatuses;
  } catch (error) {
    console.error("Error finding order:", error);
    throw error;
  }
}

  
  async function userOrderHistory(userId) {
    try {
      const orders = await Order.find({
        user: userId,
        orderStatus: { $in: ["PLACED", "PENDING"] }
      })
        .populate({
          path: 'user',
          select: 'username email' 
        })
        .lean();
  
   if (orders.length === 0) {
    return { success: false, message: 'Order list is empty' };
  }

  return { success: true, orders };
    } catch (error) {
      console.error("Error retrieving user order history:", error);
      throw error;
    }
  }
  


  
  async function getAllOrders(userId) {
    try {
      const orders = await Order.find({ user: userId })
        .populate({
          path: 'orderItems',
          populate: {
            path: 'product',
            model: 'Product',
          },
        })
        .lean();
  
      return orders;
    } catch (error) {
      console.error("Error retrieving user order history:", error);
      throw error;
    }
  }
  

  async function deleteOrder(orderId) {
    try {
      const order = await findOrder(orderId);
      await Order.findByIdAndDelete(order._id);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }

  module.exports = {
    createOrder,
    confirmOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    findOrder,
    userOrderHistory,
    getAllOrders,
    deleteOrder
  }

