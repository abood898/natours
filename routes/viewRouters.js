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

router.use(authController.isLogginIn);

router.route('/').get(viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.route('/login').get(viewController.getLogin);

module.exports = router;
