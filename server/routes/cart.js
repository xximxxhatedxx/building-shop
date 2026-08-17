const express = require('express');
const { sql, poolPromise } = require('../config/mssql.js');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user_id = req.user.id;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query(`
        SELECT c.id AS cart_id, c.product_id, c.quantity, 
               p.name, p.image_url, p.price, p.stock_count
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = @user_id
      `);

    const totalResult = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT dbo.fn_cart_total(@user_id) AS totalPrice');

    const items = result.recordset;
    const totalPrice = totalResult.recordset[0].totalPrice;

    res.json({ items, totalPrice });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', auth, async (req, res) => {
  let { product_id, quantity } = req.body;
  const user_id = req.user.id;
  product_id = Number(product_id);
  quantity = Number(quantity);
  if (!Number.isInteger(product_id) || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'Invalid product_id or quantity' });
  }
  try {
    const pool = await poolPromise;
    const productCheck = await pool.request()
      .input('product_id', sql.Int, product_id)
      .query('SELECT stock_count FROM products WHERE id = @product_id');
    if (!productCheck.recordset[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (quantity > productCheck.recordset[0].stock_count) {
      return res.status(400).json({ error: `Only ${productCheck.recordset[0].stock_count} in stock.` });
    }
    const check = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('product_id', sql.Int, product_id)
      .query(`
        SELECT * FROM cart WHERE user_id = @user_id AND product_id = @product_id
      `);
    if (check.recordset.length > 0) {
      return res.status(400).json({ error: 'Product already in cart. Use PUT to update quantity.' });
    }
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('product_id', sql.Int, product_id)
      .input('quantity', sql.Int, quantity)
      .query(`
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (@user_id, @product_id, @quantity)
      `);
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/', auth, async (req, res) => {
  let { product_id, quantity } = req.body;
  const user_id = req.user.id;
  product_id = Number(product_id);
  quantity = Number(quantity);
  if (!Number.isInteger(product_id) || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'Invalid product_id or quantity' });
  }
  try {
    const pool = await poolPromise;
    const productCheck = await pool.request()
      .input('product_id', sql.Int, product_id)
      .query('SELECT stock_count FROM products WHERE id = @product_id');
    if (!productCheck.recordset[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (quantity > productCheck.recordset[0].stock_count) {
      return res.status(400).json({ error: `Only ${productCheck.recordset[0].stock_count} in stock.` });
    }
    const check = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('product_id', sql.Int, product_id)
      .query(`
        SELECT * FROM cart WHERE user_id = @user_id AND product_id = @product_id
      `);
    if (check.recordset.length === 0) {
      return res.status(404).json({ error: 'Product not found in cart. Use POST to add.' });
    }
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('product_id', sql.Int, product_id)
      .input('quantity', sql.Int, quantity)
      .query(`
        UPDATE cart
        SET quantity = @quantity
        WHERE user_id = @user_id AND product_id = @product_id
      `);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.post('/order', auth, async (req, res) => {
  const user_id = req.user.id;
  const { address, payment } = req.body;
  if (!address || !payment) {
    return res.status(400).json({ error: 'Address and payment data required' });
  }
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('user_id', sql.Int, user_id);
    request.input('address', sql.NVarChar(255), address);
    request.output('order_id', sql.Int);
    await request.execute('sp_create_order');
    const orderId = request.parameters.order_id.value;
    res.json({ success: true, orderId });
  } catch (err) {
    if (err.originalError && err.originalError.info && err.originalError.info.message) {
      return res.status(400).json({ error: err.originalError.info.message });
    }
    console.error('Order creation failed:', err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

router.delete('/:cart_id', auth, async (req, res) => {
  const user_id = req.user.id;
  const cart_id = Number(req.params.cart_id);
  if (!Number.isInteger(cart_id)) {
    return res.status(400).json({ error: 'Invalid cart_id' });
  }
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('cart_id', sql.Int, cart_id)
      .query(`
        DELETE FROM cart WHERE id = @cart_id AND user_id = @user_id
      `);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;