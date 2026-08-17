const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Product, Category } = require('../models');
const sql = require('mssql');
const { poolPromise } = require('../config/mssql.js');


router.get('/', async (req, res) => {
  const {
    category,
    search,
    sortBy,
    minPrice = 0,
    maxPrice = 1000000,
    page = 1,
    limit = 20,
    showDeleted = false
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const pool = await poolPromise;

    let query = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.price >= @minPrice AND p.price <= @maxPrice
    `;

    const inputParams = [
      { name: 'minPrice', type: sql.Decimal(10, 2), value: minPrice },
      { name: 'maxPrice', type: sql.Decimal(10, 2), value: maxPrice },
      { name: 'offset', type: sql.Int, value: parseInt(offset) },
      { name: 'limit', type: sql.Int, value: parseInt(limit) }
    ];

    if (category) {
      query += ' AND p.category_id = @category';
      inputParams.push({ name: 'category', type: sql.Int, value: parseInt(category) });
    }

    if (search) {
      query += ' AND p.name LIKE @search';
      inputParams.push({ name: 'search', type: sql.VarChar, value: `%${search}%` });
    }

    if (!showDeleted || showDeleted === '0') {
      query += ' AND p.is_deleted = 0';
    }

    switch (sortBy) {
      case 'priceAsc': query += ' ORDER BY p.price ASC'; break;
      case 'priceDesc': query += ' ORDER BY p.price DESC'; break;
      case 'nameAsc': query += ' ORDER BY p.name ASC'; break;
      case 'nameDesc': query += ' ORDER BY p.name DESC'; break;
      default: query += ' ORDER BY p.id DESC'; break;
    }

    query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';

    let request = pool.request();
    inputParams.forEach(p => request.input(p.name, p.type, p.value));

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/max-price', async (req, res) => {
  const { category, search, minPrice = 0, maxPrice = 1000000 } = req.query;

  try {
    const pool = await poolPromise;

    let query = `
      SELECT MAX(price) AS maxPrice
      FROM products
      WHERE price >= @minPrice
    `;

    const inputParams = [
      { name: 'minPrice', type: sql.Decimal(10, 2), value: minPrice }
    ];

    if (category) {
      query += ' AND category_id = @category';
      inputParams.push({ name: 'category', type: sql.Int, value: parseInt(category) });
    }

    if (search) {
      query += ' AND name LIKE @search';
      inputParams.push({ name: 'search', type: sql.VarChar, value: `%${search}%` });
    }

    const request = pool.request();
    inputParams.forEach(p => request.input(p.name, p.type, p.value));

    const result = await request.query(query);
    res.json({ maxPrice: result.recordset[0].maxPrice || 10000 });
  } catch (err) {
    console.error('Error fetching max price:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 4 
        p.id, p.name, p.description, p.price, p.category_id, p.image_url, p.stock_count, p.created_at, p.is_deleted,
        COUNT(oi.product_id) AS order_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      WHERE p.is_deleted = 0
      GROUP BY 
        p.id, p.name, p.description, p.price, p.category_id, p.image_url, p.stock_count, p.created_at, p.is_deleted
      ORDER BY order_count DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching popular products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = @id
      `);

    if (!result.recordset[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, description, price, category_id, image_url, stock_count } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar(20), name)
      .input('description', sql.VarChar(55), description)
      .input('price', sql.Decimal(10, 2), price)
      .input('category_id', sql.Int, category_id)
      .input('image_url', sql.VarChar(70), image_url)
      .input('stock_count', sql.Int, stock_count)
      .output('new_id', sql.Int)
      .execute('addProducts');

    if (result.returnValue === 501) {
      return res.status(400).json({ error: 'Category does not exist' });
    }
    if (result.returnValue === 502) {
      return res.status(400).json({ error: 'Product with this name already exists' });
    }

    res.status(201).json({ id: result.output.new_id });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, description, price, category_id, image_url, stock_count } = req.body;
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.update({ name, description, price, category_id, image_url, stock_count });
    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  let product;
  try {
    product = await Product.findByPk(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({ is_deleted: true });
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
