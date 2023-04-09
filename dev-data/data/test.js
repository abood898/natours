const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../../config.env` });
const Tour = require('./../../models/tourModel');
const DB = process.env.DATABASE_LOCAL;

mongoose.set('strictQuery', true);
mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours, { validateBeforeSave: false });
  } catch (error) {
    console.log(error);
  }
};

importData();
