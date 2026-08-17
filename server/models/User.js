const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(30), allowNull: false },
  email: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(70), allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
