// orderController.js
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const User = require("../models/User");
/* const Order = require("../models/Order");
const OrderItems = require("../models/OrderItems"); */
const { Order, OrderItems } = require("../models");

exports.getOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please log in to view your orders" });
    }
    const orders = await Order.findAll({
      where: {
        user_id: req.user.dataValues.id,
      },
      include: OrderItems,
    });
    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please log in to view your orders" });
    }
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.dataValues.id,
      },
      include: OrderItems,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
