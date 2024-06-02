const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'book_library',
  password: 'T@rajova1623',
  port: 5432
});

module.exports = pool;
