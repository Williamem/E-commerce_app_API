const {
  User,
  Order,
  OrderItems,
  Address,
  Product,
} = require("../models/index");
const { productValidator } = require("../validators/validators");


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

exports.createProduct = async (req, res) => {
    const validationResult = productValidator.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({error: validationResult.error.details[0].message})
    }
    if (!req.body.stock) {
        req.body.stock = 0
    }
    try {
        product = await Product.create({
            ...req.body,
        });

        res.status(201).json(product)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error in createProduct'});
    }
};

exports.updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, description, stock, image_url, category } = req.body;

    try {
        const existingProduct = await Product.findByPk(id);
        if (!existingProduct) {
            return res.status(404).json({error: 'Product not found'});
        }
            await existingProduct.update({
                name,
                price,
                description,
                stock,
                image_url,
                category
            });
            return res.status(200).json(existingProduct);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update the product' });
        }
}


exports.deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const productToDelete = await Product.findByPk(id);
        if (!productToDelete) {
            return res.status(404).json({message: 'Product not found'});
        }
        await productToDelete.destroy();
        return res.status(200).json({message: 'Product deleted successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error in deleteProduct'});
    }
};

exports.getProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error in getProduct'});
    }
}