const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../../routes');

let numberOfReceivedRequests = 0;

const init = (logger) => {
  logger.info('Setting express API.');
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.disable('x-powered-by');

  logger.info('Setting API cross domain.');
  // ALLOW CROSS DOMAIN
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  logger.info('Setting API security policy.');
  // CONTENT SECURITY POLICY
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  logger.info('Setting API middleware.');
  app.use((req, res, next) => {
    numberOfReceivedRequests += 1;
    logger.info(`got request from: ${req.ip} route: '${req.originalUrl}' params: ${JSON.stringify(req.params)}`);
    res.set('Content-Type', 'application/json');
    next();
  });

  logger.info('Setting API health route.');
  // HEATLH (API STATUS)
  app.get('/health', (req, res) => {
    res.status(200).json({
      upTime: process.uptime(),
      numberOfReceivedRequests,
      osFreeMem: os.freemem(),
      serviceMemoryUsage: process.memoryUsage()
    });
  });

  logger.info('Setting API routes.');
  // ROUTES FOR PATIENTS
  app.use('/api/v1', routes);

  // HANDLE UNKNOW ROUTES
  app.use((req, res) => {
    res.status(404).json({ info: 'Resource not found.' });
  });

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
