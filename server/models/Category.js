const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(20), allowNull: false },
  description: { type: DataTypes.STRING(60) },
  image_url: { type: DataTypes.STRING(110) }
}, {
  tableName: 'categories',
  timestamps: false
});

module.exports = Category;
