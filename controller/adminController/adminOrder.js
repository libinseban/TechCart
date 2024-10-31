const Order = require("../../models/server/orderModel");

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'address', select: 'streetAddress city state zipCode' })
      .populate({ path: 'products', select: 'title price' })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
}

const confirmOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "CONFIRMED" }, { new: true });
    return res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const shippingOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "SHIPPED" }, { new: true });
    return res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deliverOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "DELIVERED" }, { new: true });
    return res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelledOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: "CANCELLED" }, { new: true });
    return res.status(200).json({ success: true, updatedOrder });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteOrders = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  confirmOrders,
  shippingOrders,
  deliverOrders,
  cancelledOrders,
  deleteOrders,
};
