const mongoose = require('mongoose');
const wishList = require("../../models/cart/wishList");
const Product = require("../../models/server/productModel"); 
const Cart=require('../../models/cart/cartModel')
const CartItem = require('../../models/cart/cartItem');
const { addCartItem } = require('../service/cartService');
const ObjectId = mongoose.Types.ObjectId;

const updateWishList = async (req, res) => {
  const { userId } = req.body;
const {productId}=req.params;
  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ error: 'Invalid productId or userId' });
  }

  try {
    let wishlist = await wishList.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new wishList({ user: userId, products: [{product:productId,quantity:1}] });
    } else {
      const existingProduct = wishlist.products.find(item => item.product.equals(productId));
      if (existingProduct) {
        existingProduct.quantity += 1;
        }
        else {
          wishlist.products.push({ product: productId, quantity: 1 });
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
  const { productId } = req.params; 

  try {
    const wishlist = await wishList.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).send({ error: "Wishlist not found for the given userId." });
    }

    const existingProduct = wishlist.products.find(item => item.product.equals(productId));
    
    if (!existingProduct) {
      return res.status(404).send({ error: "Product not found in wishlist." });
    }

    existingProduct.quantity -= 1;

    if (existingProduct.quantity <= 0) {
      wishlist.products = wishlist.products.filter(item => !item.product.equals(productId));
    }

    await wishlist.save();

    return res.status(200).send({ message: "Product quantity decreased successfully", updatedWishlist: wishlist });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return res.status(500).send({ error: "Internal Server Error. Please try again later." });
  }
};

const getAllProducts = async (req, res) => {
  const { userId } = req.body;
  
  try {
    const wishlist = await wishList.findOne({ user: userId }).populate('products.product');

    if (wishlist) {
      const productDetails = wishlist.products.map(item => ({
        product: item.product,
        quantity: item.quantity, 
      }));

      if (productDetails.length === 0) {
        return res.status(200).send({ message: "Wishlist is empty." });
      }
      return res.status(200).send({ message: "Products in WishList", productDetails });
      
    } else {
      return res.status(404).send({ error: "Wishlist not found for the given userId." });
    }
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return res.status(500).send({ error: "Internal Server Error. Please try again later." });
  }
};

const getProduct = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    const wishlist = await wishList.findOne({ user: userId }).populate('products.product');
    
    if (!wishlist) {
      console.log("Wishlist not found");
      return res.status(404).send({ message: "Wishlist not found" });
    }

    const product = wishlist.products.find(item => item.product.toString() === productId);

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
  const { userId, quantity } = req.body;
  const { productId } = req.params;

  try {
    if (!productId || !userId) {
      return res.status(400).send({ error: "Product ID and User ID are required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cartItem: [] });
    }
    
    const cartItems = await addCartItem(userId, { productId, quantity });

    await wishList.findOneAndUpdate(
      { user: userId },
      { $pull: { product: productId } },
      { new: true }
    );


    return res.status(200).send({
      message: "Product moved to cart successfully",
      cartItems
    });

  } catch (error) {
    console.error("Error moving product to cart:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = { moveProductToCart, removeWishList, updateWishList, getAllProducts, getProduct };
