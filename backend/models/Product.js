const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Product = db.define('items', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL
    },
    description: {
        type: Sequelize.TEXT
    },
    stock: {
        type: Sequelize.INTEGER
    },
    image_url: {
        type: Sequelize.STRING
    },
    category: {
        type: Sequelize.STRING
    },
}, {
    timestamps: false
});

module.exports = Product;