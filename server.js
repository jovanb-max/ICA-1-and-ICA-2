require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const cors = require('cors');



// const secret = process.env.JWT_SECRET || "your_default_secret_key";


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token)
  if (!token) return res.sendStatus(401);
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;


// Routes
// Get all books or search by title (public)
app.get('/books', async (req, res) => {
  const { search } = req.query;
  try {
    let result;
    if (search) {
      result = await pool.query('SELECT * FROM books WHERE title ILIKE $1', [`%${search}%`]);
    } else {
      result = await pool.query('SELECT * FROM books');
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO librarians (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]  //hashedPassword instead of password if wanna create a user with hash password 
    );

    // Return the created user
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Librarian login route
let secret = "56a6d157ad7d2ee09e480960ae857e528ae546d156f47433b1afad162311c45aa520697b65d13a5c72891f6145ab1f2675886fc124027dc95f86073dd8fe1462"
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM librarians WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(400).send('Cannot find user');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');
    // const accessToken = jwt.sign({ username: user.username }, process.env.secret);
    // const accessToken = jwt.sign( "postgres" , secret);
    const accessToken = jwt.sign({ username: user.username }, secret, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add a new book (librarian only)
app.post('/books', authenticateToken, async (req, res) => {
  const { title, author, genre } = req.body;

  // Validate the request body
  if (!title || !author || !genre) {
    return res.status(400).json({ error: 'Title, author, and genre are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *',
      [title, author, genre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// Update an existing book (librarian only)
app.patch('/books/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, author, genre } = req.body;

  if (!title && !author && !genre) {
    return res.status(400).json({ error: 'At least one field (title, author, genre) is required to update' });
  }

  try {
    const result = await pool.query(
      'UPDATE books SET title = COALESCE($1, title), author = COALESCE($2, author), genre = COALESCE($3, genre) WHERE id = $4 RETURNING *',
      [title, author, genre, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

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


// Delete a librarian by id
app.delete('/librarians/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM librarians WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// let secret = "56a6d157ad7d2ee09e480960ae857e528ae546d156f47433b1afad162311c45aa520697b65d13a5c72891f6145ab1f2675886fc124027dc95f86073dd8fe1462"
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM librarians WHERE username = $1', [username]);
//     const user = result.rows[0];

//     if (!user) {
//       console.log('Cannot find user');
//       return res.status(400).send('Cannot find user');
//     }

//     console.log(`Entered Password: ${password}`);
//     console.log(`Stored Password: ${user.password}`);

//     if (password !== user.password) {
//       console.log('Invalid password');
//       return res.status(400).send('Invalid password');
//     }

//     const accessToken = jwt.sign( "postgres", secret);
//     res.json({ accessToken });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
