'use strict';

const jwt = require('express-jwt');
const logger = require('../logger.js');
const app = require('../server.js');
const jwtconfig = require('../Config/jwtconfig.json');
const Token = require('../Token/token.js');

const isRevokedCallback = function(req, payload, done){
    const issuer = payload.iss;
    const tokenId = payload.id;

    const regex = new RegExp(`${tokenId}`, "i");
    Token.findOne({id: regex})
        .exec((err, token) => {
            if (err) {
                logger.error(`Failure in tokenId lookup with error: ${err}`);
                return done(err);
            }
            return done(null, !!token);
        });
};

const jwtMiddleware = jwt({
    secret: jwtconfig.secret,
    algorithm: jwtconfig.algorithm,
    isRevoked: isRevokedCallback,
    getToken: function fromQuerystring (req) {
        if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({path: /\/token/i });

module.exports = jwtMiddleware;