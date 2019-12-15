const http = require('http');
const logger = require('./utils/logger');
const environmentVariables = require('./utils/variablesValidation');
const dataBase = require('./utils/database');
const api = require('./utils/api');

const service = () => {
  this.log = null;

  return {
    setupLogger: async () => {
      this.log = await logger.init();
    },

    validateEnvironment: async () => environmentVariables.validate(this.log),

    setupMongoDB: async () => dataBase.init(this.log),

    setupExpress: async () => {
      this.express = await api.init(this.log);
    },

    createService: async () => {
      try {
        this.log.info('Creating server');
        this.server = await http.createServer(this.express);
        this.log.info('Server creation: Status SUCCESS');
      }
      catch (error) {
        this.log.error('Server creation: Status FAILED');
        throw new Error(error);
      }
    },

    startService: () => {
      this.server.listen(this.express.get('port'));
      this.log.info('Server Status UP');
      return Promise.resolve();
    },

    stopService: () => {
      this.server.close();
      this.log.info('Server Status Stopped');
      return Promise.resolve();
    }
  };
};

module.exports = service;
