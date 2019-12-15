const requiredVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASS',
  'DB_SCHEMA',
  'NODE_ENV',
  'SERVICE_NAME',
  'PORT'
];

const validate = (logger) => {
  logger.info('Validate environment variables for service.');
  const variablesSet = Object.keys(process.env);
  let success = true;

  requiredVariables.forEach((variable) => {
    const notFound = variablesSet.indexOf(variable) === -1;
    if (notFound) {
      logger.error(`Variable [${variable}] missing`);
      success = false;
    }
    else {
      logger.info(`Variable [${variable}] set`);
    }
  });

  if (success) {
    logger.info('Env variables initialization SUCCESS.');
  }
  else {
    logger.error('Env variables initialization FAILED.');
    logger.error('One or more env variables are not properly set, please check .env file');
    throw new Error('One or more env variables are not properly set, please check .env file');
  }
  return success;
};

module.exports = {
  validate
};
