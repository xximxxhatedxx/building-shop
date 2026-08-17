const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(20), allowNull: false },
  description: { type: DataTypes.STRING(55) },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  image_url: { type: DataTypes.STRING(70) },
  stock_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = Product;
