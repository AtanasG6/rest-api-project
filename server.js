const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./database');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============= AUTH ENDPOINTS =============

// POST - Регистрация на нов потребител
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Проверка дали user вече съществува
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Хеширане на паролата
    const hashedPassword = await bcrypt.hash(password, 10);

    // Създаване на потребител
    const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = insert.run(name, email, hashedPassword);

    // Генериране на JWT token
    const token = jwt.sign(
      { userId: result.lastInsertRowid, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: result.lastInsertRowid, name, email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Намиране на потребител
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Проверка на паролата
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генериране на JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= PROTECTED USER ENDPOINTS =============

// GET - Вземане на всички потребители (защитен endpoint)
app.get('/api/users', authMiddleware, (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Вземане на един потребител по ID (защитен endpoint)
app.get('/api/users/:id', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Създаване на нов потребител (използвай /api/auth/register вместо това)
// Този endpoint вече не се използва - users се създават чрез /api/auth/register

// PUT - Обновяване на потребител (защитен endpoint)
app.put('/api/users/:id', authMiddleware, (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const update = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    const result = update.run(name, email, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Изтриване на потребител (защитен endpoint)
app.delete('/api/users/:id', authMiddleware, (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = deleteStmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Стартиране на сървъра
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/users`);
});
