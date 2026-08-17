const express = require('express');
const { sql, poolPromise } = require('../config/mssql.js');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/my', auth, async (req, res) => {
  const user_id = req.user.id;
  try {
    const pool = await poolPromise;
    const ordersResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query(`
        SELECT id, status, total_price, address, created_at
        FROM orders
        WHERE user_id = @user_id
        ORDER BY created_at DESC
      `);
    const orders = ordersResult.recordset;
    if (!orders.length) return res.json([]);
    const orderIds = orders.map(o => o.id).join(',');
    const itemsResult = await pool.request()
      .query(`
        SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price, p.name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${orderIds})
      `);
    const itemsByOrder = {};
    itemsResult.recordset.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    });
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: itemsByOrder[order.id] || []
    }));
    res.json(ordersWithItems);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;