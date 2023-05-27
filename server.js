process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception, shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
).replace('<user>', process.env.DATABASE_USERNAME);

// let DB = process.env.DATABASE_LOCAL;
mongoose.set('strictQuery', true);

mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhadeld rejection, shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
