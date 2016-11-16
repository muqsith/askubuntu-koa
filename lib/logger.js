'use strict';

var winston = require('winston');
var config = require('config');

var createLogger = function()
{
    var logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)(config.get('logger.console')),
          new (winston.transports.File)(config.get('logger.file'))
        ]
      });
    return logger;
};
const logger = createLogger();

module.exports = logger;
