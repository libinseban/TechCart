const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')
const reviwController=require('../../controller/orderController/reviewController')

routes.post('/create',authenticate,reviwController.createReview);
routes.get('/product/:productId',authenticate,reviwController.getAllReview);

module.exports=routes;