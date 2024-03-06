// cartController.js
const { CartItem, Product, Order, OrderItems } = require("../models/index");

exports.getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please log in to use the cart" });
        }
        const cartItems = await CartItem.findAll({
            where: {
                user_id: req.user.id
            },
            include: Product
        });
        if (cartItems.length === 0) {
            return res.status(200).json({ message: "Cart is empty" });
        }
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const { item_id, quantity } = req.body;
    let itemQuantity = parseInt(quantity);
    if (!req.user) {
        return res.status(401).json({ message: "Please log in to use the cart" });
    }
    if (!itemQuantity) {
        itemQuantity = 1;
    }
    if (!item_id) {
        return res.status(400).json({ message: "Item ID is required" });
    }
    try {
        const product = await Product.findByPk(item_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const cartItem = await CartItem.findOne({
            where: {
                user_id: req.user.dataValues.id,
                item_id
            }
        });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            return res.status(200).json(cartItem);
        }
        const newCartItem = await CartItem.create({
            user_id: req.user.dataValues.id,
            item_id,
            quantity: itemQuantity
        });
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please log in to use the cart" });
        }
        const cartItem = await CartItem.findOne({
            where: {
                user_id: req.user.dataValues.id,
                item_id: id
            }
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        await cartItem.destroy();
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please log in to use the cart" });
        }
        await CartItem.destroy({
            where: {
                user_id: req.user.dataValues.id
            }
        });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please log in to use the cart" });
        }
        const cartItem = await CartItem.findOne({
            where: {
                user_id: req.user.dataValues.id,
                item_id: id
            }
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        cartItem.quantity = quantity;
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkout = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please log in to use the cart" });
        }
        const cartItems = await CartItem.findAll({
            where: {
                user_id: req.user.id
            }
        });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        let total = 0;
        for (let i = 0; i < cartItems.length; i++) {
            const product = await Product.findByPk(cartItems[i].item_id);
            total += product.price * cartItems[i].quantity;
        }
        console.log('req.params', req.params);
        const newOrder = await Order.create({
            user_id: req.user.dataValues.id,
            address_id: req.body.address_id,
            order_date: new Date(),
            total_price: total,
            status: "pending"
        });
        await OrderItems.bulkCreate(cartItems.map(item => ({
            order_id: newOrder.id,
            item_id: item.item_id,
            quantity: item.quantity
        })));
        await CartItem.destroy({
            where: {
                user_id: req.user.id
            }
        });
        console.log('newOrder',newOrder);
        res.status(200).json({ message: "Checkout successful", newOrder: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};