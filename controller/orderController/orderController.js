const { createOrder, findOrder, userOrderHistory } = require("../service/orderSevice");

const newOrder = async (req, res) => {
  const {shippingAddress } = req.body;
  const userId = req.cookies.userId;
  if (!userId || !shippingAddress) {
    return res.status(400).send({ error: 'User ID and shipping address are required' });
  }
  try {
    const createdOrder = await createOrder(userId, shippingAddress);
    return res.status(201).send(createdOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const findOrderById = async (req, res) => {
  const userId=req.cookies.userId
  const { productId } = req.params;

 
  try {
    const order = await findOrder(productId, userId);
    return res.status(200).send(order);
  } catch (error) {
    console.error("Error in findOrderById:", error.message);
    return res.status(500).send({ error: error.message });
  }
};


const OrderHistory = async (req, res) => {
  const userId=req.cookies.userId


  try {
    if (!userId) {
      return res.status(400).send({ error: "User ID is required" });
    }

    const orders = await userOrderHistory(userId);
    return res.status(200).send(orders);
  } catch (error) {
    console.error("Error in OrderHistory controller:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  OrderHistory,
  findOrderById,
  newOrder,
};
