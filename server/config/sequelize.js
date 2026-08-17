const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    port: parseInt(process.env.DB_PORT),
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true
      }
    },
    logging: false
  }
);

module.exports = sequelize;
