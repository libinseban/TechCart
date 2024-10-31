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

    if (!cart || !cart.cartItem || cart.cartItem.length === 0) {
      return { message: "Cart is empty" };
    }

    const cartItems = cart.cartItem;

    let totalPrice = 0;
    let totalDiscountPrice = 0;
    let totalItem = 0;

    const productsWithQuantities = cartItems.map(({ product, price, discountPrice, quantity }) => {
      totalPrice += price * quantity;
      totalDiscountPrice += discountPrice * quantity;
      totalItem += quantity;

      return {
        productId: product ? product._id : null, 
        quantity,
        price,
        discountPrice,
      };
    });

    const filteredProducts = productsWithQuantities.filter(item => item.productId !== null);

    return {
      cart: cart._id,
      user: cart.user,
      products: filteredProducts,
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

async function addCartItem(userId, { productId }) {
  try {
      let cart = await Cart.findOne({ user: userId }).populate('cartItem').exec();
      if (!cart) {
          cart = await CreateCart(userId);
      }
      const product = await Products.findById(productId);
      if (!product) {
          throw new Error("Product not found");
      }

      const quantity = 1;

      const existingCartItem = cart.cartItem.find(item => item.product.toString() === productId);
      if (existingCartItem) {
          existingCartItem.quantity += quantity; 
          await existingCartItem.save(); 
      } else {
          const newCartItem = new CartItem({
              product: productId,
              quantity: quantity, 
              user: userId,
              price: product.price,
              discountPrice: product.discountPrice || 0,
              cart: cart._id,
          });
          await newCartItem.save(); 
          cart.cartItem.push(newCartItem._id); 
          await cart.save(); 
      }

      return await findUserCart(userId); 
  } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error; 
  }
}

async function removeCartItem(userId, productId) {

  try {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      console.log("Cart not found");
      throw new Error("Cart not found");
    }

    const removedCartItem = await CartItem.findByIdAndDelete({
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
