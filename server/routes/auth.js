const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../config/mssql.js');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/me', auth, async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const pool = await poolPromise;

    const userResult = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT * FROM users WHERE id = @id');

    const user = userResult.recordset[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.request()
      .input('id', sql.Int, userId)
      .input('name', sql.VarChar(50), name)
      .input('email', sql.VarChar(50), email)
      .query('UPDATE users SET name = @name, email = @email WHERE id = @id');

    const updatedUser = { ...user, name, email };
    delete updatedUser.password;

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await poolPromise;

    const checkUser = await pool.request()
      .input('email', sql.VarChar(50), email)
      .query('SELECT id FROM users WHERE email = @email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.request()
      .input('name', sql.VarChar(50), name)
      .input('email', sql.VarChar(50), email)
      .input('password', sql.VarChar(255), hashedPassword)
      .query(`
        INSERT INTO users (name, email, password)
        OUTPUT INSERTED.id
        VALUES (@name, @email, @password)
      `);

    const userId = insertResult.recordset[0].id;

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('email', sql.VarChar(50), email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;