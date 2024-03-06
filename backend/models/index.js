const Address = require("./Address");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItems = require("./OrderItems");
const Product = require("./Product");
const User = require("./User");
const UserRole = require("./UserRole");

Order.belongsTo(User, { foreignKey: "user_id" });
Order.hasMany(OrderItems, { foreignKey: "order_id" });
OrderItems.belongsTo(Order, { foreignKey: "order_id" });
OrderItems.belongsTo(Product, { foreignKey: "item_id" });
Address.belongsTo(User, {foreignKey: 'user_id'});
CartItem.belongsTo(User, {foreignKey: 'user_id'});
CartItem.belongsTo(Product, {foreignKey: 'item_id'});
User.belongsTo(UserRole, {foreignKey: 'role_id'});

module.exports = { Address, CartItem, Order, OrderItems, Product, User, UserRole};
