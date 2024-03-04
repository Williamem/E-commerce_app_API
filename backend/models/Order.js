//Order.js
const Sequelize = require('sequelize');
const { db } = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Order = db.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    order_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    total_price: {
        type: Sequelize.DECIMAL
    },
    ship_date: {
        type: Sequelize.DATE
    },
    status: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['pending', 'shipped', 'delivered']]
        }
    },
    tracking_information: {
        type: Sequelize.TEXT
    }
}, { timestamps: false });

Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Order;