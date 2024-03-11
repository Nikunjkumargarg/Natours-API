const { Client } = require('pg');
const fs = require('fs');
const { argv } = require('process');

// Create a PostgreSQL client
const Tour = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'natours',
  password: 'Nikunj@gauri32',
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
Tour.connect();

async function inserData() {
  try {
    // Read the JSON file containing the objects
    const jsonData = fs.readFileSync('tours-simple.json');
    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Iterate over each object and insert it into the table
    for (const obj of data) {
      const insertQuery =
        'INSERT INTO Tour (name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, summary, description, imageCover, images, startDates) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

      const values = [
        obj.name.trim(),
        obj.duration,
        obj.maxGroupSize,
        obj.difficulty,
        obj.ratingsAverage,
        obj.ratingsQuantity,
        obj.price,
        obj.summary.trim(),
        obj.description.trim(),
        obj.imageCover,
        obj.images,
        obj.startDates,
      ];

      await Tour.query(insertQuery, values);
      console.log('Inserted:', obj.name);
    }
    // Close the connection
    await Tour.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit();
}

async function deleteData() {
  try {
    await Tour.query('DELETE FROM Tour');
    console.log('deleted successfully');
    await Tour.end();
    console.log('Connection closed.');
  } catch (err) {
    console.log('Error', err);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  inserData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
