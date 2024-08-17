const mongoose = require('mongoose');
const wishList = require("../../models/cart/wishList");
const Product = require("../../models/server/productModel"); 
const Cart=require('../../models/cart/cartModel')
const { json } = require('express');
const CartItem = require('../../models/cart/cartItem');
const ObjectId = mongoose.Types.ObjectId;

const updateWishList = async (req, res) => {
  const { userId, productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ error: 'Invalid productId or userId' });
  }

  try {
    let wishlist = await wishList.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new wishList({ user: userId, product: [productId] });
    } else {
      // Avoid adding duplicate products
      if (!wishlist.product.includes(productId)) {
        wishlist.product.push(productId);
      }
    }

    await wishlist.save();

    return res.status(200).send({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    return res.status(500).send({ error: 'Internal Server Error. Please try again later.' });
  }
};

const removeWishList = async (req, res) => {
  const { userId } = req.body;
  const productId = req.params.productId; 

  try {
    const wishlist = await wishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).send({ error: "Wishlist not found for the given userId." });
    }

    const updatedWishlist = await wishList.findOneAndUpdate(
      { user: userId },
      { $pull: { product: productId } }, 
      { new: true } 
    );

    if (updatedWishlist) {
      return res.status(200).send({ message: "Product removed successfully", updatedWishlist });
    } else {
      return res.status(400).send({ error: "Failed to remove product from wishlist. Ensure the item exists." });
    }
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return res.status(500).send({ error: "Internal Server Error. Please try again later." });
  }
}

const getAllProducts = async (req, res) => {
  const { userId } = req.body
  try {
    const wishlist = await wishList.findOne({ user: userId }).populate('product');

    if (wishlist) {
      const products = wishlist.product;
      console.log(products)
      return res.status(200).send({ message: "Products in WishList" ,products});
    } else {
      return res.status(404).send({ error: "Wishlist not found for the given userId." });
    }
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return res.status(500).send({ error: "Internal Server Error. Please try again later." });
  }
}


const getProduct = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    // Find the wishlist for the user and populate product details
    const wishlist = await wishList.findOne({ user: userId }).populate('product');
    
    if (!wishlist) {
      console.log("Wishlist not found");
      return res.status(404).send({ message: "Wishlist not found" });
    }
console.log(wishlist.product)
    // Find the specific product in the wishlist
    const product = wishlist.product.find(item => item._id.toString() === productId);

    if (!product) {
      console.log("Product not found in Wishlist");
      return res.status(404).send({ message: "Product not found in Wishlist" });
    }

    return res.status(200).send({ message: "Product found in Wishlist", product });
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return res.status(500).send({ error: "Internal Server Error. Please try again later." });
  }
};

const moveProductToCart = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    // Validate input
    if (!productId || !userId) {
      return res.status(400).send({ error: "Product ID and User ID are required" });
    }

    // Find the wishlist for the user
    const wishlist = await wishList.findOne({ user: userId }).populate('product');
    if (!wishlist) {
      return res.status(404).send({ error: "Wishlist not found" });
    }

    // Create or find the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cartItem: [] });
    }

    console.log("products in cartItems  :"  + cart.cartItem.product)
    // Check if the product is already in the cart
    const productInCart = cart.cartItem.some(item => item.product.toString() === productId);
    if (productInCart) {
      return res.status(400).send({ message: "Product is already in the cart" });
    }

    // Find the product in the wishlist
    const product = wishlist.product.find(prod => prod._id.toString() === productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found in wishlist" });
    }

    // Add the product to the cart
    cart.cartItem.push({
      product: product._id,
      quantity: 1,
      price: product.price || 0,
      discountPrice: product.discountPrice || 0,
    });

    await cart.save();

    // Remove the product from the wishlist
    await wishList.updateOne(
      { user: userId },
      { $pull: { product: product._id } }
    );

    // Send the response only once
    return res.status(200).send({
      message: "Product moved to cart successfully",
      cart,
    });
  } catch (error) {
    // Log error and send error response
    console.error("Error moving product to cart:", error);

    // Ensure only one response is sent
    if (!res.headersSent) {
      return res.status(500).send({ error: "Internal Server Error. Please try again later." });
    }
  }
};

module.exports = { moveProductToCart,removeWishList, updateWishList, getAllProducts ,getProduct};
