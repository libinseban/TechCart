const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')

const ordercontroller=require('../../controller/orderController/orderController')

routes.post('/create',authenticate,ordercontroller.createOrder);
routes.get('/history',authenticate,ordercontroller.OrderHistory);
routes.get('/search/:id',authenticate,ordercontroller.findOrderById);


module.exports = routes;

