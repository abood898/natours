const AppEroor = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { upload, resizeImage } = require('../utils/uploadImage.js');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const sharp = require('sharp');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.setMyId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  resizeImage({
    memory: req.file.buffer,
    width: 500,
    height: 500,
    extension: 'jpeg',
    imageQuality: 90,
    imagePath: `./public/img/users/${req.file.filename}`,
  });
  next();
};
exports.uploadUserPhoto = upload.single('photo');
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppEroor(
        'This route is not for password updates. user /updateMyPassword route for that.',
        400
      )
    );
  }
  const filterdBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterdBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (res, req, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
