const Sequelize = require('sequelize');
const { db } = require('../config/database');

const UserRole = db.define('user_roles', {
  role_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  role_name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
}, {
    timestamps: false
});

module.exports = {UserRole};