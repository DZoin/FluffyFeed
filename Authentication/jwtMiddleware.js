'use strict';

const jwt = require('express-jwt');
const logger = require('../logger.js');
const app = require('../server.js');
const jwtconfig = require('../Config/jwtconfig.json');

const isRevokedCallback = function(req, payload, done){
  const issuer = payload.iss;
  const tokenId = payload.jti;

  data.getRevokedToken(issuer, tokenId, function(err, token){
    if (err) { 
        return done(err);
    }
    return done(null, !!token);
  });
};

const jwtMiddleware = jwt({
    secret: jwtconfig.secret,
    getToken: function fromQuerystring (req) {
        if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({path: ['/token']});

module.exports = jwtMiddleware;