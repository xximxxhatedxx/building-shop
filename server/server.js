const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const {sql, poolPromise} = require('./config/mssql.js');
const authRoutes = require('./routes/auth.js')
const productRoutes = require('./routes/products.js')
const cartRoutes = require('./routes/cart.js')
const orderRoutes = require('./routes/orders.js')

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

const sequelize = require('./config/sequelize');

sequelize.authenticate()
  .then(() => console.log('Sequelize connection established'))
  .catch(err => console.error('Sequelize connection error:', err));
