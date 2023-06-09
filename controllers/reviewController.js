const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review, [
  { path: 'user', select: 'name' },
  { path: 'tour', select: '-guides name' },
]);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
