const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')
const reviwController=require('../../controller/orderController/reviewController')

routes.post('/create',authenticate,reviwController.createReview);
routes.get('/:productId',authenticate,reviwController.getAllReview);
routes.delete('/:reviewId', authenticate, reviwController.deleteReview)

module.exports=routes;