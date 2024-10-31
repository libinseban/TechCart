

const Order = require("../../models/server/orderModel");
const Product = require("../../models/server/productModel");

const getOrders = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    const products = await Product.find({ seller: sellerId }).populate(
      "seller"
    );

    if (!products) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }
    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    if (orders.length > 0) {
      return res.status(200).json({ success: true, orders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const confirmOrders = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    const products = await Product.find({ seller: sellerId }).populate(
      "seller"
    );

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    console.log("Orders found:", orders);

    if (orders.length > 0) {
      const updatedOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "CONFIRMED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, updatedOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error confirming orders:", error);
    return res.status(500).json({ error: "Failed to confirm orders." });
  }
};

const shippingOrders = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    const products = await Product.find({ seller: sellerId }).populate(
      "seller"
    );

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    console.log("Orders found:", orders);

    if (orders.length > 0) {
      const shippedOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "SHIPPED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, shippedOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const deliverOrders = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    const products = await Product.find({ seller: sellerId }).populate(
      "seller"
    );

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    if (orders.length > 0) {
      const deliveredOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "DELIVERED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, deliveredOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const cancelOrders = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    const products = await Product.find({ seller: sellerId }).populate(
      "seller"
    );

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    if (orders.length > 0) {
      const cancelledOrders = await Promise.all(
        orders.map((order) =>
          Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "CANCELLED" },
            { new: true }
          )
        )
      );
      return res.status(200).json({ success: true, cancelledOrders });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const deleteOrders = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    const products = await Product.find({ seller: sellerId }).populate(
      "seller"
    );

    if (!products.length) {
      return res
        .status(400)
        .json({ message: "No products found for this seller." });
    }

    const orders = await Order.find({
      products: { $in: products.map((product) => product._id) },
    });

    if (orders.length > 0) {
      const deletePromises = orders.map((order) =>
        Order.findByIdAndDelete(order._id)
      );

      const deletedOrders = await Promise.all(deletePromises);
      const deletedCount = deletedOrders.length;

      return res.status(200).json({
        success: true,
        message: `${deletedCount} order(s) deleted successfully.`,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No orders found for the seller." });
    }
  } catch (error) {
    console.error("Error deleting orders:", error);
    return res.status(500).json({ error: "Failed to delete orders." });
  }
};

module.exports = {
  deleteOrders,
  confirmOrders,
  cancelOrders,
  deliverOrders,
  shippingOrders,
  getOrders,
};
