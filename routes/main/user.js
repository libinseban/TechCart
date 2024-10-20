/** @format */

const express = require("express");
const userRouter = express.Router();

const userSignUpController = require("../../controller/userController/user.signup");
const userSignInController = require("../../controller/userController/user.signIn");
const userLogout = require("../../controller/userController/user.logout");
const uploadImage = require("../other/uploadImage");
const reviewRoutes = require("../service/reviewRoutes");
const ratingRoutes = require("../service/ratingRoutes");
const authenticate = require("../../middleware/authToken");
const {
  newOrder,
  OrderHistory,
  findOrderById,
} = require("../../controller/orderController/orderController");
const {
  updateWishList,
  removeWishList,
  getAllProducts,
  getProduct,
  moveProductToCart,
} = require("../../controller/productController/wishListController");
const {
  findUserCartController,
  removeItemCartController,
  addItemCartController,
  findUserCartById,
} = require("../../controller/productController/cartControl");
const {
  forgetPassword,
  resetPassword,
  getResetPassword,
} = require("../../controller/userController/forgetPassword");
const AllProducts = require("../../controller/productController/productControl");
const { cancelOrder } = require("../../controller/service/orderSevice");

userRouter.post("/signup",uploadImage, userSignUpController);
userRouter.post("/signin", userSignInController);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password/:userToken", resetPassword);
userRouter.get("/products", AllProducts.getAllProducts);

userRouter.get("/wish-list", authenticate, getAllProducts);
userRouter.get("/wish-list/get/:productId", authenticate, getProduct);
userRouter.put("/wish-list/:productId", authenticate, updateWishList);
userRouter.post(
  "/wish-list/moveToCart/:productId",
  authenticate,
  moveProductToCart
);
userRouter.delete("/wish-list/delete/:productId", authenticate, removeWishList);

userRouter.get("/cart", authenticate, findUserCartController);
userRouter.get("/cart/:productId", authenticate, findUserCartById);
userRouter.put("/cart/add", authenticate, addItemCartController);

userRouter.delete(
  "/cart/remove/:productId",
  authenticate,
  removeItemCartController
);

userRouter.put("/order", authenticate, newOrder);
userRouter.get("/order/history", authenticate, OrderHistory);
userRouter.get("/search/:productId", authenticate, findOrderById);
userRouter.delete("/removeOrder", authenticate, cancelOrder);
userRouter.use("/review", reviewRoutes);
userRouter.use("/ratings", ratingRoutes);
userRouter.post("/logout", userLogout);
module.exports = userRouter;
