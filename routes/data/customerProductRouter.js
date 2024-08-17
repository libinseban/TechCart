const express=require('express');
const routes=express.Router();
const authenticate=require('../../middleware/authToken')

const productControll=require('../../controller/orderController/productControl');


routes.get('/',authenticate,productControll.getAllProduct);
routes.get('/id:id',authenticate,productControll.findProductByid);

module.exports=routes;