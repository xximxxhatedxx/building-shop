const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'order_items',
  timestamps: false
});

module.exports = OrderItem;
