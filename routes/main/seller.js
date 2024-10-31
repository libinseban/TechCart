const seller = require("express").Router()
const sellerSignIn = require('../../controller/sellerController/sellerSignin')
const sellerSignUp  = require('../../controller/sellerController/sellerSignup')
const  sellerLogout  = require('../../controller/sellerController/sellerLogout')
const productController=require('../../controller/sellerController/sellerControl');
const productImage = require("../other/productImage");
const sellerVerify = require("../../middleware/sellerVerify");
const { forgetPassword, resetPassword } = require("../../controller/sellerController/resetPassword");
const SellerController = require("../../controller/sellerController/sellerOrderControl")

seller.post("/signup", sellerSignUp)
seller.post("/signin", sellerSignIn)
seller.post("/logout", sellerLogout)
seller.post("/forget-password", forgetPassword); 
seller.post('/reset-password/:sellerToken', resetPassword);

seller.post('/createProduct',sellerVerify,productImage,productController.createProduct);
seller.post('MultipleProducts/creates', sellerVerify,productController.createMultipleProducts);
seller.put('/updateProduct/:productId', sellerVerify,productImage,productController.updateProduct);
seller.get('/findProduct/:productId',sellerVerify, productController.findProductById);
seller.get('/getAllProducts',sellerVerify,productController.getAllProducts);
seller.delete('/deleteProduct/:productId', sellerVerify, productController.deleteProduct);

seller.get('/getOrder',sellerVerify,SellerController.getOrders)
seller.put("/confirmOrder/:orderId",sellerVerify,SellerController.confirmOrders);
seller.put("/shipOrder/:orderId",sellerVerify,SellerController.shippingOrders);
seller.put("/deliver/:orderId",sellerVerify,SellerController.deliverOrders);
seller.put("/cancelOrder/:orderId",sellerVerify,SellerController.cancelOrders);
seller.put("/deleteOrder/:orderId", sellerVerify, SellerController.deleteOrders);

module.exports = seller;