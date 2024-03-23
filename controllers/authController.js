const { User } = require('../models/userModel');
const catchASync = require('../utils/catchAsync');
const appError = require('../utils/appError');
exports.signUp = catchASync(async (req, res, next) => {
  if (req.body.password !== req.body.password_confirm) {
    throw new Error('confirm password field does not match password field');
  }
  const query = `INSERT INTO userData(name,email,password,password_confirm) VALUES($1,$2,$3,$4)`;
  console.log(req.body);
  const data = [
    req.body.name.trim(),
    req.body.email,
    req.body.password,
    req.body.password_confirm,
  ];

  const newUser = await User.query(query, data);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser.rowCount,
    },
  });
});
