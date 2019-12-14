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

  return success;
};

module.exports = {
  validate
};
