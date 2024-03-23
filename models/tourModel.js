const { Client } = require('pg');

Tour = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT, // Default PostgreSQL port
});

// Connect to the database
Tour.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Tour (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        duration NUMERIC NOT NULL,
        maxGroupSize NUMERIC NOT NULL,
        difficulty VARCHAR NOT NULL,
        ratingsAverage DECIMAL DEFAULT 4.5,
        ratingsQuantity NUMERIC DEFAULT 0,
        price NUMERIC NOT NULL,
        priceDiscount NUMERIC DEFAULT 0,
        summary VARCHAR NOT NULL,
        description VARCHAR,
        imageCover VARCHAR NOT NULL,
        images VARCHAR[],
        createdAt DATE DEFAULT CURRENT_DATE,
        startDates TEXT[],
        CONSTRAINT summary_no_whitespace CHECK (summary = TRIM(summary)),
        CONSTRAINT name_no_whitespace CHECK (name = TRIM(name)),
        CONSTRAINT description_no_whitespace CHECK (description = TRIM(description)) 
      );
    `;

    // Create the table
    return Tour.query(createTableQuery);
  })
  .then((res) => {
    console.log('Table created successfully tour');
  })
  .catch((err) => {
    console.error(
      'Error connecting to or creating table in PostgreSQL database:',
      err,
    );
  });

module.exports = { Tour };
