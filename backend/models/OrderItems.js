const Sequelize = require('sequelize');
const { db } = require('../config/database');
const Product = require('./Product');
const Order = require('./Order');

const OrderItems = db.define('orders_items', {
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Order,
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

}, { timestamps: false });
module.exports = OrderItems;