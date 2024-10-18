const express = require("express")
const adminRouter = express.Router()
const adminSignIn = require("../../controller/adminController/adminSignIn")
const adminSignUp = require("../../controller/adminController/adminSignUp")
const adminToken=require("../../middleware/adminVerification")
const adminLogout = require("../../controller/adminController/adminLogOut")
const OrderController = require("../../controller/adminController/adminOrder")
const productController = require('../../controller/productController/productControl');
const approveSellers=require("../other/control")
const productImage = require("../other/productImage")
const authToken = require("../../middleware/authToken")
const approveSeller = require("../other/control")

adminRouter.post("/signup",adminSignUp)
adminRouter.post("/signin", adminSignIn)
adminRouter.post("/logout", adminLogout)

adminRouter.use('/upload', adminToken,productImage)

adminRouter.post('/product', adminToken,productImage, productController.createProduct);
adminRouter.get('/products/:id', adminToken, productController.findProductById);
adminRouter.get('/products',adminToken,productController.getAllProducts);
adminRouter.post('/creates', adminToken,productController.createMultipleProducts);
adminRouter.delete('/products/:id',adminToken,productController.deleteProduct);
adminRouter.put('/products/:id', adminToken,productImage, productController.updateProduct);

adminRouter.get('/orders',adminToken, OrderController.getAllOrders);
adminRouter.put("/:orderId/confirm",adminToken,OrderController.confirmOrders);
adminRouter.put("/:orderId/ship",adminToken,OrderController.shippingOrders);
adminRouter.put("/:orderId/deliver",adminToken,OrderController.deliverOrders);
adminRouter.put("/:orderId/cancel",adminToken,OrderController.cancelledOrders);
adminRouter.put("/:orderId/delete", adminToken, OrderController.deleteOrders);
adminRouter.use("/seller",authToken,approveSeller)

module.exports = adminRouter


