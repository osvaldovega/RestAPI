const os = require('os');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const logger = require('./utils/logger');
const environmentVariables = require('./utils/variablesValidation');

const service = () => {
  let numberOfReceivedRequests = 0;

  return {
    setupLogger: () => new Promise((resolve) => {
      this.log = logger.init();
      this.log.info('Logger process initialized.');
      resolve(this.log);
    }),

    validateEnvironment: () => new Promise((resolve, reject) => {
      this.log.info('Validate environment variables for service.');
      const onSuccess = environmentVariables.validate(this.log);

      if (!onSuccess) {
        this.log.error('One or more environment variables are not set');
        return reject();
      }

      this.log.info('All environment variables were found and set');
      resolve();
    }),

    setupMongoDB: () => new Promise((resolve, reject) => {
      const DB_URL = process.env.DB_CONNECTION_TYPE === 'aws'
        ? process.env.DB_CONNECTION
        : `${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCHEMA}`;
      mongoose.connect(
        DB_URL,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true
        }
      )
        .then(() => {
          this.log.info('DB Connection Initialized.');
          resolve();
        })
        .catch((error) => {
          this.log.error('DB Connection Failed.');
          this.log.error(`${error}`);
          reject(error);
        });
    }),

    setupExpress: () => new Promise((resolve) => {
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));
      app.disable('x-powered-by');

      // ALLOW CROSS DOMAIN
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
      });

      // CONTENT SECURITY POLICY
      app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
      });

      app.use((req, res, next) => {
        numberOfReceivedRequests += 1;
        this.log.info(`got request from: ${req.ip} route: '${req.originalUrl}' params: ${JSON.stringify(req.params)}`);
        res.set('Content-Type', 'application/json');
        next();
      });

      // HEATLH (API STATUS)
      app.get('/health', (req, res) => {
        res.status(200).json({
          upTime: process.uptime(),
          numberOfReceivedRequests,
          osFreeMem: os.freemem(),
          serviceMemoryUsage: process.memoryUsage()
        });
      });

      // ROUTES FOR PATIENTS
      app.use('/api/v1', routes);

      // HANDLE UNKNOW ROUTES
      app.use((req, res) => {
        res.status(404).json({ info: 'Resource not found.' });
      });

      app.set('port', process.env.PORT);

      this.express = app;
      this.log.info('Express Initialized.');
      resolve(app);
    }),

    createService: () => new Promise((resolve, reject) => {
      this.server = http.createServer(this.express);
      try {
        this.log.info('Server Initialized');
        resolve(this);
      }
      catch (error) {
        this.log.info('Server Creation Failed');
        reject(error);
      }
    }),

    startService: () => {
      this.server.listen(this.express.get('port'));
      this.log.info('Server is Up and Running');
      return Promise.resolve('Server Started');
    },

    stopService: () => {
      this.server.close();
      this.log.info('Server Stopped');
      return Promise.resolve('Server Stopped');
    }
  };
};

module.exports = service;
