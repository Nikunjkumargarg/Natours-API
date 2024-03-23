const { Client } = require('pg');

const User = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT, // Default PostgreSQL port
});

User.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS userData (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      email VARCHAR UNIQUE NOT NULL,
      photo VARCHAR,
      password VARCHAR NOT NULL CHECK (LENGTH(password) >= 8),
      CONSTRAINT name_no_whitespace CHECK (name = TRIM(name)),
      CONSTRAINT check_lowercase_name CHECK (name = LOWER(name)),
      CONSTRAINT valid_email CHECK (email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') 
    );
  `;
    // Create the table
    return User.query(createTableQuery);
  })
  .then((res) => {
    console.log('Table created successfully user');
  })
  .catch((err) => {
    console.error(
      'Error connecting to or creating table in PostgreSQL database:',
      err,
    );
  });

module.exports = { User };
