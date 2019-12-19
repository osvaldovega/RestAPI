const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const routes = require('./routes');
const loginRoute = require('./routes/login');
const middlewares = require('./middlewares');

const init = (logger) => {
  logger.info('Setting express API.');
  const app = express();

  // CONTENT SECURITY POLICY
  logger.info('Setting API security policy.');
  app.use(helmet());
  app.use(xss()); // data sanitazion against XSS attacks
  app.use(mongoSanitize()); // data sanitazion against NoSQL injction attacks


  // ALLOW CROSS DOMAIN
  logger.info('Setting API cross domain.');
  app.use(cors());


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json({ limit: '10kb' })); // Body limit is 10


  // MIDDLEWARE COUNTER OF REQUESTS
  logger.info('Setting API middleware.');
  app.use(middlewares.counterRequests(logger));


  // LOGIN API
  logger.info('Setting API Login route.');
  app.post(
    '/login',
    middlewares.limitAmountOfRequest,
    loginRoute
  );


  // HEATLH (API STATUS)
  logger.info('Setting API health route.');
  app.get(
    '/health',
    middlewares.limitAmountOfRequest,
    middlewares.authenticateJWT,
    middlewares.health
  );


  // ROUTES FOR USERS
  logger.info('Setting API routes.');
  app.use(
    '/api/v1',
    middlewares.authenticateJWT,
    routes
  );


  // HANDLE UNKNOW ROUTES
  app.use('*', middlewares.undefinedRoutet);


  app.set('port', process.env.PORT);
  logger.info(`Express service running on port ${process.env.PORT}`);

  if (!app) {
    logger.error('Express service not set');
    throw new Error('Express service not set');
  }

  logger.info('Express service Status UP.');
  return app;
};

module.exports = {
  init
};
