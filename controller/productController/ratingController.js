const RatingServices = require("../service/ratingService");

const createRating = async (req, res) => {
  const { ratingNumber } = req.body;
  const userId = req.cookies.userId;
  const {productId}=req.params.productId
  try {
    const rating = await RatingServices.createRating(userId,productId,ratingNumber);
    return res.status(201).send(rating);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllRating = async (req, res) => {
  const productId = req.params.productId;
  try {
    const ratings = await RatingServices.getProductRating(productId);
    return res.status(200).send(ratings);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createRating,
  getAllRating,
};
