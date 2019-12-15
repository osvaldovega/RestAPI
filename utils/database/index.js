const mongoose = require('mongoose');

const init = async (logger) => {
  logger.info('Checking DB environment variables');
  const DB_URL = process.env.DB_CONNECTION_TYPE === 'aws'
    ? process.env.DB_CONNECTION
    : `${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCHEMA}`;
  logger.info(`Connection string ${DB_URL}`);

  try {
    await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
    logger.info('Connection to data base SUCCESS.');
  }
  catch (error) {
    logger.error('Connection to data base FAILED.');
    logger.error(error.message);
    throw new Error(error);
  }
};

module.exports = {
  init
};
