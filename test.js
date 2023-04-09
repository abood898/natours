const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// const htmlToText = require('html-to-text');
// const pug = require('pug');
const Email = require('./utils/email');
const newUser = { name: 'Abd abeeed', email: 'toto@mailsac.com' };
const url = 'http://127.0.0.1:3000/me';
const d = async () => {
  await new Email(newUser, url).sendWelcome();
};
d();
