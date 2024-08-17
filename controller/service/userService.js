const User = require("../../models/client/userModel");
const cartModel = require("../../models/cart/cartModel");

async function findCartItemById(cartId) {
  console.log("Looking for cart item with ID:"+ cartId);
    try {
      
    let cartItem = await cartModel.findById(cartId)
    if (cartItem) {
      return cartItem;
    } else {
      throw new Error("Cart item not found with ID: " + cartId);
    }
  } catch (error) {
    console.error("An error occurred while finding cart item:", error);
    throw error;
  }
}


const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found with ID: " + userId);
        }
        return user;
    } catch (error) {
        throw new Error("Error finding user: " + error.message);
    }
}

module.exports = { findUserById,findCartItemById };

  