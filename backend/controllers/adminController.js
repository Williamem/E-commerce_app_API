const {
  User,
  Order,
  OrderItems,
  Address,
  Product,
} = require("../models/index");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItems,
          include: [Product],
        },
        {
          model: User,
          attributes: ["id", "email"],
        },
        {
          model: Address,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "address",
            "city",
            "state",
            "country",
          ],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItems,
          include: [Product],
        },
        {
          model: User,
          attributes: ["id", "email"],
        },
        {
          model: Address,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "address",
            "city",
            "state",
            "country",
          ],
        },
      ],
    });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedOrder = await order.update(
      {
        ...req.body,
        ship_date: new Date(),
      },
      { returning: true, plain: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
