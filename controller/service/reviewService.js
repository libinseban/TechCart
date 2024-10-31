const Reviews = require("../../models/server/review");
const Product = require("../../models/server/productModel");

async function createReview(productId, userId,reviewByUser) {
  const product = await Product.findById(productId).populate('review');

  if (!product) {
    throw new Error("Product not found");
  }
  const userDetails = await User.findById(userId).populate('review')
  
  const review = new Reviews({
    user: userDetails,
    product: product._id,
    review: reviewByUser,
    createdAt: new Date(),
  });  
  return await review.save(); 

}

async function getAllReview(productId) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return await Reviews.find({ product: productId }).populate("user");
}

module.exports = {
  getAllReview,
  createReview,
};
