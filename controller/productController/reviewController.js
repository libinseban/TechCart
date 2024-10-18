const ReviewServices = require("../service/reviewService");
const Reviews = require("../../models/server/review")


const createReview = async (req, res) => {
  const {userId,productId,reviewByUser} = req.body;
  try {
    const review = await ReviewServices.createReview(productId, userId,reviewByUser);
    return res.status(201).send(review);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  const productId = req.params.productId;
  try {
    const reviews = await ReviewServices.getAllReview(productId);
    return res.status(200).send(reviews); 
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  const reviewId  = req.params.reviewId; 

  try {
    const deletedReview = await Reviews.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).send({ error: "Review not found" });
    }

    return res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


module.exports = {
  getAllReview,
  createReview,
  deleteReview
};
