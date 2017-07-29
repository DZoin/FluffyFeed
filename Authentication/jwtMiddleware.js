'use strict';
const logger = require('../logger.js');

const jwtMiddleware = function(req, res, next) {
    logger.info("Inside middleware");
    next();
}

module.exports = jwtMiddleware;