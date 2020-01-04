const http = require('http');
const logger = require('./utils/logger');
const environmentVariables = require('./utils/variablesValidation');
const dataBase = require('./database');
const api = require('./api');

const service = () => {
  this.log = null;

  return {
    setupLogger: async () => {
      this.log = await logger.init();
    },

    validateEnvironment: async () => environmentVariables.validate(this.log),

    setupMongoDB: async () => dataBase.init(this.log),

    setupServerAPI: async () => {
      this.serverAPI = await api.init(this.log);
    },

    createService: async () => {
      try {
        this.log.info('Creating server');
        this.server = await http.createServer(this.serverAPI);
        this.log.info('Server creation: Status SUCCESS');
      } catch (error) {
        this.log.error('Server creation: Status FAILED');
        throw new Error(error);
      }
    },

    startService: () => {
      this.server.listen(process.env.PORT);
      this.log.info(`Server Listening on PORT ${process.env.PORT}`);
      return Promise.resolve();
    },

    stopService: () => {
      this.server.close();
      this.log.info('Server Status Stopped');
      return Promise.resolve();
    },
  };
};

module.exports = service;
