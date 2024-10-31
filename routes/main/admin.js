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

adminRouter.post("/signup",adminSignUp)
adminRouter.post("/signin", adminSignIn)
adminRouter.post("/logout", adminLogout)

adminRouter.use('/upload', adminToken,productImage)

adminRouter.post('/product', adminToken,productImage, productController.createProduct);
adminRouter.get('/products/:productId', adminToken, productController.findProductById);
adminRouter.get('/products',adminToken,productController.getAllProducts);
adminRouter.post('/creates', adminToken,productController.createMultipleProducts);
adminRouter.delete('/products/:productId',adminToken,productController.deleteProduct);
adminRouter.put('/products/:productId', adminToken,productImage, productController.updateProduct);

adminRouter.get('/getOrders',adminToken, OrderController.getAllOrders);
adminRouter.put("/confirmOrder/:orderId",adminToken,OrderController.confirmOrders);
adminRouter.put("/shippingOrders/:orderId",adminToken,OrderController.shippingOrders);
adminRouter.put("/deliver/:orderId",adminToken,OrderController.deliverOrders);
adminRouter.put("/cancelledOrder/:orderId",adminToken,OrderController.cancelledOrders);
adminRouter.put("/deleteOrder/:orderId", adminToken, OrderController.deleteOrders);
adminRouter.use("/approveSellers",authToken,approveSellers)

module.exports = adminRouter


