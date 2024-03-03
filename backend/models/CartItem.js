//CartItem.js
const Sequelize = require('sequelize');
const { db } = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const CartItem = db.define('cart_items', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        primaryKey: true,
    },
    item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
        primaryKey: true,
    },
    quantity: {
        type: Sequelize.INTEGER
    },
}, {  timestamps: false });

CartItem.belongsTo(User, {foreignKey: 'user_id'});
CartItem.belongsTo(Product, {foreignKey: 'item_id'});

module.exports = CartItem;

/* -- Create cart_items table
CREATE TABLE cart_items (
    user_id INTEGER REFERENCES users(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER
); */