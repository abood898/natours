const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID);

  const url = `${req.protocol}://${req.get('host')}`;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${url}/`,
    cancel_url: `${url}/tour/${tour.slug}`,
    customer_email: req.user.email,
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking, [
  { path: 'user', select: 'name' },
  { path: 'tour', select: '-guides name' },
]);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
