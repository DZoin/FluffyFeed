const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ 
        level: 'info',
        json: false,
        colorize: true
    }),
      new (winston.transports.File)({
        filename: './Logging/general.log',
        level: 'info', //should be set through the ENV
        json: false
      })
    ]
  });

module.exports = logger;