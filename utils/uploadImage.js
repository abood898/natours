const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppEroor('Not An Image!', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const resizeImage = catchAsync(async (data) => {
  await sharp(data.memory)
    .resize(data.width, data.height)
    .toFormat(data.extension)
    .jpeg({ quality: data.imageQuality })
    .toFile(data.imagePath);
});

module.exports = { upload, resizeImage };
