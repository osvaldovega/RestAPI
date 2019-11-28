const path = require('path');
const os = require('os');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const service = (serverName) => {
  let numberOfReceivedRequests = 0;

  return {
    setupLogger: () => new Promise((resolve) => {
      this.log = winston.createLogger({
        level: 'debug',
        transports: [
          new winston.transports.Console(),
          new DailyRotateFile({
            handleExceptions: false,
            json: false,
            level: 'debug',
            filename: path.join(__dirname, '/logs/', `${serverName}-%DATE%.log`),
            datePattern: 'YYYY-MM-DD-HH',
            timestamp: true,
            maxSize: '20m',
            maxFiles: '14d'
          })
        ],
        exitOnError: false
      });
      this.log.info(`${serverName}: Logger Initialized.`);
      resolve(this.log);
    }),

    validateEnvironment: () => new Promise((resolve, reject) => {
      const requiredEnvironmentVariables = [
        'DB_HOST',
        'DB_PORT',
        'DB_USER',
        'DB_PASS',
        'DB_SCHEMA',
        'NODE_ENV',
        'SERVICE_NAME',
        'PORT'
      ];

      const environmentKeys = Object.keys(process.env);

      requiredEnvironmentVariables.forEach((variable) => {
        if (environmentKeys.indexOf(variable) === -1) {
          this.log.error(`${serverName}: Service misconfiguration, missing environment variable ${variable}`);
          reject();
        }
      });
      this.log.info(`${serverName}: Environment variables set.`);
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
          this.log.info(`${serverName}: DB Connection Initialized.`);
          resolve();
        })
        .catch((error) => {
          this.log.error(`${serverName}: DB Connection Failed.`);
          this.log.error(`${serverName}: ${error}`);
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
        this.log.info(`${serverName}: got request from: ${req.ip} route: '${req.originalUrl}' params: ${JSON.stringify(req.params)}`);
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
      this.log.info(`${serverName}: Express Initialized.`);
      resolve(app);
    }),

    createService: () => new Promise((resolve, reject) => {
      this.server = http.createServer(this.express);
      try {
        this.log.info(`${serverName}: Server Initialized`);
        resolve(this);
      }
      catch (error) {
        this.log.info(`${serverName}: Server Creation Failed`);
        reject(error);
      }
    }),

    startService: () => {
      this.server.listen(this.express.get('port'));
      this.log.info(`${serverName}: Server is Up and Running`);
      return Promise.resolve('Server Started');
    },

    stopService: () => {
      this.server.close();
      this.log.info(`${serverName}: Server Stopped`);
      return Promise.resolve('Server Stopped');
    }
  };
};

module.exports = service;
