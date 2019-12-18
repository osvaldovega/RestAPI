const os = require('os');
const rateLimit = require('express-rate-limit');

const middlewares = {
  numberOfReceivedRequests: 0,

  // RATE LIMIT
  limitAmountOfRequest: rateLimit({
    max: 100, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
    message: 'Too many requests' // message to send
  }),

  // COUNTER OF REQUESTS
  counterRequests: (logger) => (req, res, next) => {
    this.numberOfReceivedRequests += 1;
    logger.info(`got request from: ${req.ip} route: '${req.originalUrl}' params: ${JSON.stringify(req.params)}`);
    res.set('Content-Type', 'application/json');
    next();
  },

  // HEATLH (API STATUS)
  health: (req, res) => {
    res.status(200).json({
      upTime: process.uptime(),
      numberOfReceivedRequests: this.numberOfReceivedRequests,
      osFreeMem: os.freemem(),
      serviceMemoryUsage: process.memoryUsage()
    });
  },

  // HANDLE UNDEFINED ROUTTES
  undefinedRoutet: (req, res) => {
    res.status(404).json({ info: 'Resource not found.' });
  }
};

module.exports = middlewares;
