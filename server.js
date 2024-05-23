const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();


app.use(bodyParser.json());

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
// Get all books (public)
app.get('/books', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM books');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Add a new book (librarian only)
  app.post('/books', authenticateToken, async (req, res) => {
    const { title, author, genre } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *',
        [title, author, genre]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Update an existing book (librarian only)
  app.patch('/books/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, author, genre } = req.body;
    try {
      const result = await pool.query(
        'UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *',
        [title, author, genre, id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Delete a book (librarian only)
  app.delete('/books/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM books WHERE id = $1', [id]);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Librarian login route
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM librarians WHERE username = $1', [username]);
      const user = result.rows[0];
      if (!user) return res.status(400).send('Cannot find user');
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).send('Invalid password');
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});