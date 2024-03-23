const { User } = require('../models/userModel');
const catchASync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchASync(async (req, res, next) => {
  if (req.body.password !== req.body.password_confirm) {
    next(
      new appError('confirm password field does not match password field', 400),
    );
  }
  const query = `INSERT INTO userData(name,email,password) VALUES($1,$2,$3) RETURNING *`;
  console.log(req.body);
  let password = await bcrypt.hash(req.body.password, 12);
  const data = [req.body.name.trim(), req.body.email, password];
  const newUser = await User.query(query, data);
  //jwt token creation. signing token means creating token with the secret present on server
  const token = signToken(newUser.rows[0].id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser.rows[0],
    },
  });
});

exports.signIn = catchASync(async (req, res, next) => {
  const { email, password } = req.body;

  //1.check if email and password exist
  if (!email || !password) {
    return next(new appError('Please provide email and password', 400));
  }
  //2. check if email and password exists in database
  const query = `SELECT * FROM userData where email = '${req.body.email}'`;
  const userData = await User.query(query);
  if (
    !userData.rows[0]?.password ||
    !(await bcrypt.compare(req.body?.password, userData.rows[0]?.password))
  ) {
    return next(new appError('Incorrect email or password', 401));
  }

  //3. send result if every thing went well
  const token = signToken(userData.rows[0].id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchASync(async (req, res, next) => {
  //1.Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new appError('You are not logged in. Please log in to get access', 401),
    );
  }
  //2.verification token
  //jwt.verify use callback, to convert it such that it return promise, we have to promisify it.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('hey', decoded);
  //3.check if user still exists
  const freshUser = await User.query(
    `select * from userData where id = ${decoded.id}`,
  );
  console.log(freshUser);
  if (freshUser.rows.length === 0) {
    return next(
      new appError(
        'The token belonging to this user does no longer exist',
        401,
      ),
    );
  }
  //4.check if user changed password after the token was issued
  next();
});