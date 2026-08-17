const { DataTypes } = require('sequelize');
const { sequelize } = require('../db.js');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(10), allowNull: false }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Role;
