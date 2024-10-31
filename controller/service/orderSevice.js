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
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_PASSWORD
  }
});
async function sendEmail(sellerEmail, sellerName, subject, productNames, orderAddress, orderDate) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: sellerEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3 style="color:blue">Dear ${sellerName},</h3>
        <p>A new order has been placed for your  product:</p>
        <ul style="list-style-type: circle; padding-left: 20px;">
          ${productNames}
        </ul>
        
        <h4>Shipping Details</h4>
        <p><strong>Name:</strong> ${orderAddress.name}<br>
        <strong>Address:</strong> ${orderAddress.streetAddress}, ${orderAddress.city}, ${orderAddress.state} - ${orderAddress.zipCode}<br>
        <strong>Contact Number:</strong> ${orderAddress.phoneNumber}</p>
        
        <p><strong>Order Date:</strong> ${orderDate.toLocaleDateString()}</p>
        
        <p>Thank you for your partnership. We will keep you informed of any updates regarding this order.</p>
        
        <p>Best regards<br></p>
      </div>`
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
      const requiredFields = ["name", 'streetAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
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
        select: 'price discountPrice seller title', 
        populate: { path: 'seller', select: 'email' }
      }
    });
    

    if (!cart || !cart.cartItem || !cart.cartItem.length) {
      throw new Error('Cart or CartItems not found');
    }

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    cart.cartItem.forEach(item => {
      totalPrice += (item.product.price * item.quantity)
      totalDiscountPrice += item.product.discountPrice * item.quantity;
      totalItem += item.quantity;
    });

    const price = totalPrice - totalDiscountPrice;
    const products = cart.cartItem.map(item => item.product._id);

    const paymentCapture = 1; 
    const razorpayOptions = {
      amount: price, 
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 10000}`,
      payment_capture: paymentCapture
    };

    const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
    console.log('Razorpay order created:', razorpayOrder);

    const order = new Order({
      user: userId,
      orderDate: new Date(),
      address: address,
      totalPrice,
      totalDiscountPrice,
      totalItem,
      price,
      products,
      paymentId: razorpayOrder.id,  
      orderStatus: 'PENDING',    
    });

    await order.save();

    const updateResult = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { cartItem: [] } },
      { new: true }
    );


    const sellers = new Set();
    cart.cartItem.forEach(item => {
      if (item.product.seller) {
        sellers.add(item.product.seller);
      }
    });

    for (const sellerId of sellers) {
      const seller = await Seller.findById(sellerId);
      
      const sellerProducts = cart.cartItem
        .filter(item => item.product.seller.toString() === sellerId.toString())
        .map(item => item.product.title) 
      
      const productNames = sellerProducts.join(", "); 

      if (seller && seller.email) {
        console.log(`Attempting to send email to seller: ${seller.email}`);
        await sendEmail(
          seller.email,
          seller.name,
          'New Order Placed',
          productNames,
          order.address,
          order.orderDate
        );
        
        console.log(`Email sent to seller: ${seller.email}`);
      } else {
        console.warn(`No email found for seller with ID: ${sellerId}`);
      }
    }
    
    

    return {
      message: 'Order placed successfully, awaiting payment',
      order,
      razorpayOrderId: razorpayOrder.id, 
      amount: price,               
      currency: "INR"
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};



const cancelOrder = async (req, res) => {
  const { productId } = req.body;
  const userId = req.cookies.userId;
  try {
    const orders = await findOrder(productId, userId);
    
    if (orders.length === 0) throw new Error('Order not found');
    
    const order = orders[0];
    
    await Order.findByIdAndUpdate(order.orderId, { orderStatus: "CANCELLED" });
    
    
    for (const product of order.products) {
      const productDetails = await Product.findById(productId).populate('seller');
      
      if (productDetails && productDetails.seller && productDetails.seller.email) {
        const sellerEmail = productDetails.seller.email;
        const subject = `Order ${order.orderId} Cancelled`;
        const message = `Dear ${productDetails.seller.name}, the order containing your product
         ${productDetails.title} has been cancelled by the user.`;

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
      orderStatus: { $in: ["CONFIRMED", "PENDING", "SHIPPED"] }
    })
    .populate({
      path: 'products',
      select: '_id title',  
    })
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
        orderStatus: { $in: [ "PENDING","CONFIRMED"] }
      })
        .populate({
          path: 'user',
          select: 'name email' 
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



  module.exports = {
    createOrder,
    cancelOrder,
    findOrder,
    userOrderHistory,
  }

