const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const express = require('express');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/name/:name')
  .get(tourController.insertTourName, tourController.getTour);
router
  .route('/id/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.use(authController.protect);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.use(authController.restrictTo('user'));

router
  .route('/:tourId/reviews')
  .get(reviewController.getAllReviews)
  .post(authController.checkAllowedToReview, reviewController.createReview);
router
  .route('/:tourId/reviews/:reviewId')
  .patch(authController.checkReviewUser, reviewController.updateReview)
  .delete(authController.checkReviewUser, reviewController.deleteReview);

module.exports = router;
