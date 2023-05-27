const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user -tour',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://code.jquery.com/jquery-3.5.1.min.js https://*.mapbox.com https://js.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com https://js.stripe.com/v3 https://code.jquery.com/jquery-3.5.1.min.js 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in',
  });
};
exports.getSignup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My Account',
  });
};
exports.emailConfirm = (req, res) => {
  res.status(200).render('emailConfirm', {
    title: 'Confirm Email',
    msg: 'A confirmation link has been sent to your email address',
  });
};
exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', { title: 'Forgot Password' });
};
exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', { title: 'Reset Password' });
};
exports.reviewForm = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user -tour',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }
  res.status(200).render('reviewForm', {
    title: 'Submit Review',
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
