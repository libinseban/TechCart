const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')
const Ratingcontroller=require('../../controller/productController/ratingController')

routes.post('/create',authenticate,Ratingcontroller.createRating);
routes.put('/product:productId',authenticate,Ratingcontroller.getAllRating);

module.exports=routes;