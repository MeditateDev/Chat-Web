const moment = require('moment');
const winston = require('winston');
const { MAX_LOG_SIZE, MAX_FILES, DEVELOP_MODE } = process.env;

const logger =
  (DEVELOP_MODE === '0' || DEVELOP_MODE === '1' || !DEVELOP_MODE) &&
  winston.createLogger({
    format: winston.format.printf(({ level, message }) => {
      const timestamp = moment().format('DD-MMM-YY dddd HH:mm:ss A');
      return `[${timestamp} ${level.toLocaleUpperCase()}] : ${
        typeof message === 'object' ? JSON.stringify(message) : message
      }`;
    }),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        dirname: 'logs',
        filename: `error_${moment().format('MMDDYY_HHmm')}.log`,
        level: 'error',
        maxsize: MAX_LOG_SIZE || 20 * 1024 * 1024,
        maxFiles: MAX_FILES || 50,
        handleExceptions: true,
        handleRejections: true,
      }),
      new winston.transports.File({
        dirname: 'Logs',
        filename: `combine_${moment().format('MMDDYY_HHmm')}.log`,
        level: 'info',
        format: winston.format.combine(
          winston.format((info) => {
            if (info.level !== 'error') {
              return info;
            }
          })()
        ),
        maxsize: MAX_LOG_SIZE || 20 * 1024 * 1024,
        maxFiles: MAX_FILES || 100,
      }),
    ],
  });

['log', 'error', 'warn', 'info'].forEach((method) => {
  const originalMethod = console[method];
  // DEVELOP_MODE = 2
  console[method] = function () {
    const timestamp = moment().format('DD-MMM-YY dddd HH:mm:ss A');
    const modifiedArgs = Array.from(arguments).map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg));
    originalMethod.call(console, `[${timestamp}]`, ...modifiedArgs);
  };
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  if (logger) {
    logger.error('Uncaught Exception:');
    logger.error(error.stack || error.message || error);
  } else {
    console.error('Uncaught Exception:');
    console.error(error.stack || error.message || error);
  }
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  if (logger) {
    logger.error('Unhandled Rejection:');
    logger.error(reason.stack || reason.message || reason);
  } else {
    console.error('Unhandled Rejection:');
    console.error(reason.stack || reason.message || reason);
  }
});
