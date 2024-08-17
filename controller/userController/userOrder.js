const orderService = require('../service/orderSevice'); 

const createOrder = async (req, res) => {
  const userId = req.body;

  try {
    let createOrder = await orderService.createorder(userId, req.body);
    return res.status(201).send(createOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  const user = req.user;

  try {
    let createOrder = await orderService.findOrderById(user, req.params.id); 
    return res.status(201).send(createOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const OrderHistory = async (req, res) => {
  const userId = req.body;

  try {
    let createOrder = await orderService.oderHistory(userId);
    return res.status(201).send(createOrder);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  OrderHistory,
  findOrderById,
  createOrder,
};
