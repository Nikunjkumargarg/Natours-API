const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const appError = require('./utils/appError');
const app = express();
const globalErrorHandler = require('./controllers/errorController');

app.use(express.json());
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
  });
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  const err = new appError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  //console.log(err);
  //if we pass something inside next then express consider it as a error
  next(err);
});

//middleware function with four parameters is considered as error handling middleware by express
app.use(globalErrorHandler);

module.exports = app;
