const mongoose = require('mongoose');

let database = null;

const createDataBase = async (logger) => {
  logger.info('Obtaining DB connection string');
  const DB_URL = process.env.DB_CONNECTION_TYPE === 'AWS'
    ? process.env.DB_CONNECTION
      .replace('<user>', process.env.DB_USER)
      .replace('<password>', process.env.DB_PASS)
      .replace('<schema>', process.env.DB_SCHEMA)
    : `${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCHEMA}`;
  logger.info(`Connection string set, TYPE ${process.env.DB_CONNECTION_TYPE}`);

  database = await mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
};

const init = async (logger) => {
  try {
    if (!database) await createDataBase(logger);
    logger.info('Connection to DB SUCCESSFUL');
    return database;
  }
  catch (error) {
    logger.error('Connection to DB FAIL');
    logger.error(error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  init
};
