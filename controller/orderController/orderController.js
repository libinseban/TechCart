const { createorder, findOrder, userOrderHistory } = require("../service/orderSevice");

const newOrder = async (req, res) => {
  const { userId, shippingAddress } = req.body;

  try {
    const createdOrder = await createorder(userId, shippingAddress);
    return res.status(201).send(createdOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  const { userId } = req.body;
  const { orderId } = req.params;

  try {
    const order = await findOrder(orderId);
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const OrderHistory = async (req, res) => {
  const { userId } = req.body;

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
