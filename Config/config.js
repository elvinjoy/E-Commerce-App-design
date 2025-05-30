const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  USER_JWT_SECRET: process.env.USER_JWT_SECRET,
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,
};
