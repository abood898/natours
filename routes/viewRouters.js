const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/me').get(authController.protect, viewController.getAccount);
router.get(
  '/my-tours',
  //   bookingController.createBookingCheckout,
  authController.protect,
  viewController.getMyTours
);

router.use(authController.isLoggedIn);

router.route('/').get(viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.route('/tour/:slug/add-review').get(viewController.reviewForm);
router.route('/login').get(viewController.getLogin);
router.route('/signup').get(viewController.getSignup);
router.route('/emailConfirm').get(viewController.emailConfirm);
router.route('/forgot-password').get(viewController.forgotPassword);
router.route('/resetPassword/:token').get(viewController.resetPassword);

module.exports = router;
