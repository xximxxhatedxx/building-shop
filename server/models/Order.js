const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING(10), defaultValue: 'pending' },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;
