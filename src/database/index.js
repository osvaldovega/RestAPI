const mongoose = require('mongoose');

let database = null;

const createDataBase = async (logger) => {
  logger.info('Obtaining DB connection string');

  const {
    DB_CONNECTION_TYPE,
    DB_CONNECTION,
    DB_HOST,
    DB_PASS,
    DB_PORT,
    DB_SCHEMA,
    DB_TYPE,
    DB_USER
  } = process.env;

  // GET CONNECTION STRING
  const connectionString = DB_CONNECTION_TYPE === 'AWS'
    ? DB_CONNECTION
      .replace('<user>', DB_USER)
      .replace('<password>', DB_PASS)
      .replace('<schema>', DB_SCHEMA)
    : `${DB_TYPE}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_SCHEMA}`;

  logger.info(`Connection string set, TYPE ${DB_CONNECTION_TYPE}`);

  // MONGO DB CONNECTION
  database = await mongoose
    .connect(
      connectionString,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
    );
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
