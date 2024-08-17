const Cart = require("../../models/cart/cartModel");
const Products = require("../../models/server/productModel");
const CartItem = require("../../models/cart/cartItem");

async function CreateCart(userId) {

  try {
    const cart = new Cart({ user:userId });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw error;
  }
}

async function findUserCart(userId) {
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate({ path: 'cartItem', strictPopulate: false })
      .exec();

    if (!cart || !cart.cartItem) {
      throw new Error("cart or cart-items not found");
    }

    const cartItems = cart.cartItem;

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    for (let cartItem of cartItems) {
      totalPrice += cartItem.price * cartItem.quantity;
      totalDiscountPrice += cartItem.discountPrice * cartItem.quantity;
      totalItem += cartItem.quantity;
    }

    return {
      cart: cart._id,
      user: cart.user,
      totalDiscountPrice,
      totalPrice,
      totalItem,
      price: totalPrice - totalDiscountPrice,
    };
  } catch (error) {
    console.error("Error finding user cart:", error);
    throw error;
  }
}




async function addCartItem(userId, { productId, quantity }) {
  try {
    let cart = await Cart.findOne({ user: userId }).populate({ path: 'cartItem' })
    .exec();;

    if (!cart) {
      cart = await CreateCart(userId);
    }

    const product = await Products.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const isPresent = await CartItem.findOne({
      product: productId,
      cart: cart._id
    });

    if (!isPresent) {
      const newCartItem = new CartItem({
        product: productId,
        quantity: quantity || 1,
        user: userId,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        cart: cart._id,
      });

      await newCartItem.save();

      cart.cartItem.push(newCartItem); 
      await cart.save();
      return await findUserCart(userId); 
    } else {
      return "Item is already in the cart";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function removeCartItem(userId, productId) {
  console.log("User ID:", userId);
  console.log("Product ID:", productId);

  try {
    // Find the cart associated with the user
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      console.log("Cart not found");
      throw new Error("Cart not found");
    }

    const removedCartItem = await CartItem.findOneAndDelete({
      product: productId
    });

    if (!removedCartItem) {
      console.log("Cart item not found");
      throw new Error("Cart item not found");
    }

    await Cart.updateOne(
      { user: userId },
      { $pull: { cartItems: removedCartItem._id } }
    );

    return await findUserCart(userId);
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
}




module.exports = { findUserCart, addCartItem, removeCartItem };
