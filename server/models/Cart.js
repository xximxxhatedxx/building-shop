const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'cart',
  timestamps: false
});

module.exports = Cart;
