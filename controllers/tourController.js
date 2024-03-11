const { Tour } = require('../models/tourModel');

exports.getTours = async (req, res, next) => {
  if (req.params.id) {
    try {
      const searchQuery = `SELECT * FROM tour WHERE id = ${req.params.id * 1}`;
      const result = await Tour.query(searchQuery);
      if (result.rows.length < 1) {
        res.status(400).json({
          requestedAt: req.requestTime,
          status: 'fail',
          message: 'id does not exist or no data corresponding to this id',
        });
      } else {
        res.status(200).json({
          requestedAt: req.requestTime,
          status: 'success',
          tour: result.rows,
        });
      }
    } catch (err) {
      res.status(400).json({
        requestedAt: req.requestTime,
        status: 'fail',
        message: err,
      });
    }
  } else {
    try {
      const searchQuery = 'SELECT * FROM tour';
      const result = await Tour.query(searchQuery);
      const rows = result.rows; // Access the rows returned by the query
      res.status(200).json({
        requestedAt: req.requestTime,
        status: 'success',
        tours: rows,
      });
    } catch (err) {
      res.status(400).json({
        requestedAt: req.requestTime,
        status: 'fail',
        message: err,
      });
    }
  }
};

exports.addTour = async (req, res, next) => {
  try {
    console.log(req.body);
    const insertQuery =
      'INSERT INTO Tour (name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, summary, description, imageCover, images, startDates) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

    // Data to be inserted
    const data = [
      req.body.name.trim(),
      req.body.duration,
      req.body.maxGroupSize,
      req.body.difficulty,
      req.body.ratingsAverage,
      req.body.ratingsQuantity,
      req.body.price,
      req.body.summary.trim(),
      req.body.description.trim(),
      req.body.imageCover,
      req.body.images,
      req.body.startDates,
    ]; // Removed quotes from req.body.name

    await Tour.query(insertQuery, data, (err, result) => {
      if (err) {
        console.error('Error adding tour:', err);
        res.status(401).json({
          requestedAt: req.requestTime,
          status: 'fail',
          message: err,
        });
      } else {
        console.log('Tour added successfully');
        res.status(201).json({
          requestedAt: req.requestTime,
          status: 'success',
          message: result.rowCount,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      requestedAt: req.requestTime,
      status: 'fail',
      message: `${err}`,
    });
  }
};

exports.updateTour = async (req, res, next) => {
  try {
    let updateQuery = 'UPDATE Tour SET ';
    const data = [];
    const fieldsToUpdate = req.body; // Assuming req.body contains the fields to update

    // Construct the SET clause of the query dynamically based on the fields to update
    let setClause = '';
    let index = 1;
    for (const field in fieldsToUpdate) {
      setClause += `${field} = $${index}, `;
      data.push(fieldsToUpdate[field]);
      index++;
    }
    setClause = setClause.slice(0, -2); // Remove the trailing comma and space

    // Append the SET clause to the updateQuery
    updateQuery += setClause;

    // Append the WHERE clause if needed (assuming req.params.id contains the ID of the tour to update)
    if (req.params.id) {
      updateQuery += ` WHERE id = $${index}`;
      updateQuery += ' RETURNING *';
      data.push(req.params.id);
    }
    const result = await Tour.query(updateQuery, data);
    if (result.rowCount > 0) {
      res.status(201).json({
        requestedAt: req.requestTime,
        status: 'success',
        data: {
          tour: result.rows,
        },
      });
    } else {
      res.status(200).json({
        requestedAt: req.requestTime,
        status: 'fail',
        message: 'no record found with the given id',
      });
    }
  } catch (err) {
    res.status(400).json({
      requestedAt: req.requestTime,
      status: 'fail',
      message: err,
    });
  }
  //
};

exports.deleteTour = async (req, res, next) => {
  try {
    const deleteQuery = 'DELETE FROM Tour WHERE id = $1';
    const data = [req.params.id]; // Assuming req.params.id contains the ID of the tour to delete

    const result = await Tour.query(deleteQuery, data);

    if (result.rowCount === 1) {
      // The row was successfully deleted
      //not send any data to client on delete operation - convention of rest api
      res.status(204).json({
        requestedAt: req.requestTime,
        status: 'success',
        message: 'Tour deleted successfully',
      });
    } else {
      // No rows were affected (probably because the ID was not found)
      res.status(404).json({
        requestedAt: req.requestTime,
        status: 'fail',
        message: 'Tour not found',
      });
    }
  } catch (err) {
    console.error('Error executing DELETE query:', err);
    res.status(500).json({
      requestedAt: req.requestTime,
      status: 'fail',
      message: 'Could not delete tour',
    });
  }
};
