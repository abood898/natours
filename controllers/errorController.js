const AppError = require('./../utils/appError');
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate filed value ${value}. please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token please login again', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired please login again', 401);

const sendErrorDev = (error, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API
    return res.status(error.statusCode).json({
      status: error.status,
      error,
      message: error.message,
      stack: error.stack,
    });
  }
  // RENDERD PAGE

  return res.status(error.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: error.message,
  });
};
const sendErrorProd = (error, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
  // RENDERD PAGE
  if (error.isOperational) {
    return res.status(error.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: error.message,
    });
  }
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // This code needs fixing , destructring object not working thus values are undefined
    let err = { ...error };
    err.message = error.message;
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
    sendErrorProd(err, req, res);
  }
};
