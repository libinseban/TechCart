const express = require("express")
const control=require("./control")
const adminRouter = express.Router()
const adminSignIn = require("../../controller/adminController/adminSignIn")
const adminSignUp = require("../../controller/adminController/adminSignUp")
const adminToken=require("../../middleware/adminVerification")
const adminLogout = require("../../controller/adminController/adminLogOut")
const OrderController = require("../../controller/adminController/adminOrder")
const productController=require('../../controller/orderController/productControl');

adminRouter.post("/signup",adminSignUp)
adminRouter.post("/signin", adminSignIn)

adminRouter.post("/control", adminToken, control)

adminRouter.post('/product', adminToken, productController.createProduct);
adminRouter.get('/products/:id', adminToken, productController.findProductById);
adminRouter.get('/products',adminToken,productController.getAllProducts);
adminRouter.post('/creates', adminToken,productController.createMultipleProducts);
adminRouter.delete('/products/:id',adminToken,productController.deleteProduct);
adminRouter.put('/products/:id', adminToken, productController.updateProduct);

adminRouter.get('/orders',adminToken, OrderController.getAllOrders);
adminRouter.put("/:orderId/confirm",adminToken,OrderController.confirmOrders);
adminRouter.put("/:orderId/ship",adminToken,OrderController.shippingOrders);
adminRouter.put("/:orderId/deliver",adminToken,OrderController.deliverOrders);
adminRouter.put("/:orderId/cancel",adminToken,OrderController.cancelledOrders);
adminRouter.put("/:orderId/delete", adminToken, OrderController.deleteOrders);
adminRouter.post("/logout", adminLogout)
module.exports = adminRouter


