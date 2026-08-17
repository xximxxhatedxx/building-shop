const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/mssql.js');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('id', decoded.id)
      .query('SELECT * FROM users WHERE id = @id');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
