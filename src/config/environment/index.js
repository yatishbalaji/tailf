const path = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');

const env = !process.env.DB_URL ? dotenv.config({}).parsed: {};

const all = {
  root: path.normalize(`${__dirname}/../../..`),
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
};

module.exports = _.merge(
  all,
  env,
);
