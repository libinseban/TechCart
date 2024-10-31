const Rating = require('../../models/server/ratingModel.js');
const Product = require('../../models/server/productModel.js');
const User = require('../../models/client/userModel.js');

async function createRating(productId, userId,ratingNumber) {
  const product = await Product.findById(productId).populate('rating');

  if (!product) {
    throw new Error("Product not found");
  }
  
  const rating = new Rating({
    product: product._id,
    user: userId,
    rating: ratingNumber,
    createdAt: new Date(),
  });

  return await rating.save();
}

async function getProductRating(productId) {
  return await Rating.find({ product: productId }).populate("user");
}

module.exports = {
  createRating,
  getProductRating,
};
