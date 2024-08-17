const cartService = require("./cartService");
const Address = require("../../models/server/addressModel");
const Order = require("../../models/server/orderModel");
const OrderItem = require('../../models/server/oderItem');
const User = require('../../models/client/userModel');
const Cart = require("../../models/cart/cartModel");

async function createorder(userId, shippingAddress) {
  try {
    let address;
    
    if (shippingAddress._id) {
      address = await Address.findById(shippingAddress._id);
    } else {
      address = new Address({ ...shippingAddress, user: userId });
      await address.save();
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.address.includes(address._id)) {
      user.address.push(address._id);
      await user.save();
    }

    const cart = await cartService.findUserCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderItems = cart.items.map(cartItem => ({
      product: cartItem.product._id,
      quantity: cartItem.quantity,
      price: cartItem.price,
      discountPrice: cartItem.discountPrice,
      user: userId
    }));

    const createOrder = new Order({
      user: userId,
      totalPrice: cart.totalPrice,
      totalItem: cart.totalItem,
      totalDiscountPrice: cart.totalDiscountPrice,
      shippingAddress: address._id, 
      orderItems: orderItems,
      orderDate: new Date(),
      createAd: new Date(),
    });

    const savedOrder = await createOrder.save();

    // Remove items from the cart after the order is created
    await Cart.findByIdAndUpdate(cart._id, { items: [] });

    return savedOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

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

async function cancelOrder(orderId) {
  try {
    const order = await findOrder(orderId);
    order.orderStatus = "CANCELLED";
    return await order.save();
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
}

async function findOrder(orderId) {
  try {
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "orderItems",
        populate: { path: "product" }
      })
      .populate("shippingAddress");

    return order;
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
          .populate({ path: "product", populate: { path: "product" } })
          .lean();
          
  
      console.log("Orders found:", orders); // Debug log
      return orders;
    } catch (error) {
      console.error("Error retrieving user order history:", error);
      throw error;
    }
  }
  

  
async function getAllOrders() {
  try {
    return await Order.find()
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();
  } catch (error) {
    console.error("Error retrieving all orders:", error);
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
  createorder,
  confirmOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  findOrder,
  userOrderHistory,
  getAllOrders,
  deleteOrder,
};
