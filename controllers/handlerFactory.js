const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.params.tourId) {
      req.body.tour = req.params.tourId;
      req.params.id = req.params.reviewId;
    }
    if (req.user.id) req.body.user = req.user.id;

    const doc = await Model.findByIdAndDelete(req.params.id);
    console.log(doc);
    if (!doc) {
      return next(new AppError('No document was found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.params.tourId) {
      req.body.tour = req.params.tourId;
      req.params.id = req.params.reviewId;
    }
    if (req.user.id) req.body.user = req.user.id;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.params.tourId) req.body.tour = req.params.tourId;
    if (req.user.id) req.body.user = req.user.id;
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    res.status(200).json({
      status: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested get reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      length: docs.length,
      data: {
        documents: docs,
      },
    });
  });
