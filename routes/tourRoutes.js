const express = require('express');
const {
  getTours,
  updateTour,
  deleteTour,
  addTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');
const router = express.Router();

router.route('/:id?').get(getTours).patch(updateTour).delete(deleteTour);

router.route('/').post(addTour);

module.exports = router;
