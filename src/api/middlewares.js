const os = require('os');
const rateLimit = require('express-rate-limit');
const helper = require('../../utils/helpers');


let numberOfReceivedRequests = 0;

// RATE LIMIT
const limitAmountOfRequest = rateLimit({
  max: 100, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
  message: 'Too many requests' // message to send
});

// COUNTER OF REQUESTS
const counterRequests = (logger) => (req, res, next) => {
  numberOfReceivedRequests += 1;
  logger.info(`got request from: ${req.ip} route: '${req.originalUrl}' params: ${JSON.stringify(req.params)}`);
  res.set('Content-Type', 'application/json');
  next();
};

// HEATLH (API STATUS)
const health = (req, res) => {
  res.status(200).json({
    upTime: process.uptime(),
    numberOfReceivedRequests,
    osFreeMem: os.freemem(),
    serviceMemoryUsage: process.memoryUsage()
  });
};

// JWT VALIDATION
const authenticateJWT = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'no token provided' });

  try {
    const user = await helper.verifyAccessToken(token);
    req.user = user;
    return next();
  }
  catch (error) {
    return res.status(403).json({ message: 'Token Forbidden' });
  }
};

// HANDLE UNDEFINED ROUTTES
const undefinedRoutet = (req, res) => {
  res.status(404).json({ info: 'Resource not found.' });
};


module.exports = {
  authenticateJWT,
  counterRequests,
  health,
  limitAmountOfRequest,
  undefinedRoutet
};
