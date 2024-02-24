const Sequelize = require('sequelize');
const { db } = require('../config/database');
const UserRole= require('./UserRole');

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role_id: {
    type: Sequelize.INTEGER,
    references: {
      model: UserRole,
      key: 'role_id',
    }
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'createdat'
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'updatedat'
  }
});

User.belongsTo(UserRole, {foreignKey: 'role_id'});

module.exports = User;