const seller = require("express").Router()
const sellerSignIn = require('../../controller/sellerController/sellerSignin')
const sellerSignUp  = require('../../controller/sellerController/sellerSignup')
const  sellerLogout  = require('../../controller/sellerController/sellerLogout')
const productController=require('../../controller/sellerController/sellerControl');
const productImage = require("../other/productImage");
const sellerVerify = require("../../middleware/sellerVerify");
const { forgetPassword, resetPassword } = require("../../controller/sellerController/resetPassword");

seller.post("/signup", sellerSignUp)
seller.post("/signin", sellerSignIn)
seller.post("/logout", sellerLogout)
seller.post("/forget-password", forgetPassword); 
seller.post('/reset-password/:sellerToken', resetPassword);

seller.post('/product',sellerVerify,productImage,productController.createProduct);
seller.post('/creates', sellerVerify,productController.createMultipleProducts);
seller.put('/:productId', sellerVerify,productImage,productController.updateProduct);
seller.get('/product/:productId',sellerVerify, productController.findProductById);
seller.get('/products/:sellerId',sellerVerify,productController.getAllProducts);
seller.delete('/:productId',sellerVerify,productController.deleteProduct);

module.exports = seller;