
const { findUserCart, addCartItem,removeCartItem } = require("../service/cartService");
const CartItem = require("../../models/cart/cartItem");
const { default: mongoose } = require("mongoose");
const Cart = require("../../models/cart/cartModel");

const findUserCartController = async (req, res) => {
  const userId  = req.cookies.userId;


  try {
    const cartItems = await findUserCart(userId);
    if (!cartItems) {
      return res.status(404).json({ message: "Cart not found for user" });
  }

  res.status(200).json({ cartItems });  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const addItemCartController = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = cookies.userId;
  if (!userId) {
    return res.status(400).send({ error: "User not authenticated" });
  }


  try {
    const cartItem = await addCartItem(userId, { productId, quantity });
    return res.status(200).send({json:"product added to your Cart" , cartItem});
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return res.status(500).send({ error: error.message });
  }
};
const removeItemCartController = async (req, res) => {
  const userId  = req.cookies.userId;
  const { productId } = req.params;
  if (!userId) {
    return res.status(400).send({ error: "User not authenticated" });
  }

  try {
    const updatedCart = await removeCartItem(userId, productId);
    return res.status(200).send({ json: "Product removed from your cart", updatedCart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).send({ error: error.message });
  }
};

const findUserCartById = async (req, res) => {
  const userId = req.cookies.userId;
  const { productId } = req.params;

  if (!userId) {
    return res.status(400).send({ error: "User not authenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send({ error: "Invalid product ID" });
  }

  try {
    const cartItem = await CartItem.findOne({product:productId}).populate('product');

    if (!cartItem) {
      return res.status(404).send({ message: "Product not found in Cart" });
    }

    return res.status(200).send({ message: "Product found in Cart", product: cartItem.product });
  } catch (error) {
    console.error("Error finding product in cart:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  findUserCartController,
  addItemCartController,
  removeItemCartController,
  findUserCartById
};
