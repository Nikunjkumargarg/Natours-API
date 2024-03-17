const { Tour } = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage|desc,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = async (req, res, next) => {
  const queryObject = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((item) => delete queryObject[item]);
  if (req.params.id) {
    try {
      //Field limiting
      if (req.query.fields) {
        const fields = req.query.fields;
        console.log(fields);
        var searchQuery = `SELECT ${fields} FROM tour WHERE id = ${req.params.id * 1}`;
        console.log(searchQuery);
      } else {
        var searchQuery = `SELECT * FROM tour WHERE id = ${req.params.id * 1}`;
        console.log(searchQuery);
      }
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
          results: result.rowCount,
          tour: result.rows,
        });
      }
    } catch (err) {
      res.status(400).json({
        requestedAt: req.requestTime,
        status: 'fail',
        message: `${err}`,
      });
    }
  } else {
    try {
      if (req.query.fields) {
        const fields = req.query.fields;
        console.log(fields);
        var searchQuery = `SELECT ${fields} FROM tour WHERE`;
        console.log(searchQuery);
      } else {
        var searchQuery = 'SELECT * FROM tour WHERE';
        console.log(searchQuery);
      }
      //build query dynamially if there is an object fields which we have to put as where condition in the query
      //Filtering
      //in the documentation mention the syntax require for advance filtering like duration[>]=5
      for (let key in queryObject) {
        if (typeof queryObject[key] === 'object' && key !== null) {
          for (let objKey in queryObject[key]) {
            const value = queryObject[key][objKey];
            searchQuery += ` ${key} ${objKey} ${value} AND`;
          }
        } else {
          let value = queryObject[key];
          searchQuery += ` ${key} = ${value} AND`;
        }
      }

      // Remove the trailing 'AND' from the query string
      searchQuery = searchQuery.slice(0, -4);
      console.log(searchQuery);
      console.log(req.query);

      //sorting

      if (req.query.sort) {
        let count = 0;
        let sortPara = req.query.sort.split(',');
        for (let i = 0; i < sortPara.length; i++) {
          count++;
          if (sortPara[i].endsWith(`${'desc' || 'asc'}`)) {
            if (count == 1) {
              searchQuery += ` ORDER BY ${sortPara[i].replace('|', ' ')}`;
              console.log(searchQuery);
            } else {
              searchQuery += `, ${sortPara[i].replace('|', ' ')}`;
              console.log(searchQuery);
            }
          } else {
            if (count == 1) {
              searchQuery += ` ORDER BY ${sortPara[i]}`;
              console.log(searchQuery);
            } else {
              searchQuery += `, ${sortPara[i]}`;
              console.log(searchQuery);
            }
          }
        }
      } else {
        searchQuery += ` ORDER BY createdat desc`;
        console.log(searchQuery);
      }

      //pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;
      if (req.query.page) {
        const countQuery = await Tour.query(`select * FROM tour`);
        console.log(`nikunj ${countQuery.rowCount}`);
        console.log(searchQuery);
        if (req.query.page * limit > countQuery.rowCount) {
          throw new Error('This page does not exist');
        }
      }
      if (req.query.page && req.query.limit) {
        searchQuery += ` OFFSET ${skip} LIMIT ${limit}`;
        console.log(searchQuery);
      }

      if (req.query.limit) {
        searchQuery += ` LIMIT ${limit}`;
        console.log(searchQuery);
      }

      const result = await Tour.query(searchQuery);
      const rows = result.rows; // Access the rows returned by the query
      res.status(200).json({
        requestedAt: req.requestTime,
        status: 'success',
        results: result.rowCount,
        tours: rows,
      });
    } catch (err) {
      res.status(400).json({
        requestedAt: req.requestTime,
        status: 'fail',
        message: `${err}`,
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

exports.getTourStats = async (req, res, next) => {
  try {
    console.log('hello');
    const query = `SELECT difficulty, AVG(price) AS Average_Price, AVG(ratingsaverage) AS Average_Rating, MIN(price) AS Minimum_Price, MAX(price) AS Maximum_Price, SUM(ratingsQuantity) AS Total_Rating, COUNT(*) AS Total_Tour from tour where ratingsaverage >= 4.5 GROUP BY difficulty ORDER BY Average_Price ASC`;

    const data = await Tour.query(query);
    res.status(200).json({
      status: 'success',
      data: data.rows,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `${err}`,
    });
  }
};