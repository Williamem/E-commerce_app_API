const Sequelize = require('sequelize');
const { db } = require('../config/database');
const User = require('./User');

const Address = db.define('shipping_addresses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    },
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
}, {
    timestamps: false
});

module.exports = Address;
