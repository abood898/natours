const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const express = require('express');
const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview);
module.exports = router;
