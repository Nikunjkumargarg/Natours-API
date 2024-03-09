const express = require('express');
const {getTours,updateTour,deleteTour,addTour, checkID, checkBody} = require('../controllers/tourController');
const router = express.Router();

router.param('id',checkID);

router.route('/:id?').get(getTours).patch(updateTour).delete(deleteTour);

router.route('/').post(checkBody,addTour);

module.exports = router;