const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getCart = async (req, res) => {
    try {
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
    if (!req.user.dataValues.id) {
        return res.status(401).json({ message: "Please sign in to add items to cart" });
    }
    if (!itemQuantity) {
        quantity = 1;
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