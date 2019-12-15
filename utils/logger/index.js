const path = require('path');
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

let logger = null;

const init = () => {
  if (logger) return logger;

  logger = createLogger({
    level: process.env.LOG_LEVEL,

    exitOnError: false,

    format: format.combine(
      format.simple(),
      format.timestamp(),
      format.printf((data) => `[${data.timestamp}] - [${data.level.toUpperCase()}] - [${process.env.SERVICE_NAME}] - ${data.message}`)
    ),

    transports: [
      new transports.Console({
        colorize: true
      }),

      new DailyRotateFile({
        handleExceptions: true,
        humanReadableUnhandledException: true,
        json: false,
        filename: path.join(__dirname, '../../logs/', `${process.env.SERVICE_NAME}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD-HH',
        timestamp: true,
        maxSize: '5m',
        maxFiles: '5d',
        colorize: true
      })
    ]
  });

  if (logger) {
    logger.info('Logger initialization SUCCESS.');
  }
  else {
    throw new Error('Logger initialization FAIL.');
  }

  return logger;
};

module.exports = {
  init
};
