const express = require('express');
const {
  getTours,
  updateTour,
  deleteTour,
  addTour,
  checkID,
  checkBody,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const router = express.Router();

router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(aliasTopTours, getTours);

router.route('/:id?').get(getTours).patch(updateTour).delete(deleteTour);

router.route('/').post(addTour);


module.exports = router;
