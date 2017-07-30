'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../logger.js');
const jwtconfig = require('../Config/jwtconfig.json');
const Token = require('./token.js');
const router = express.Router();
const one_day = 1440;

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/**
 * @api {get} /token Get a JWT
 * @apiName GetToken
 * @apiGroup Token
 * @apiSuccess{string}token The JWT
 * @apiSuccessExample Sample response
  {
    "success": true,
    "message": "Token issued successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4NGFkOWU0LTlkMjAtNGY0YS05YmU5LWMwYThkYjIwZWRiYiIsImlhdCI6MTUwMTM5OTg5MiwiZXhwIjoxNTAxNDAxMzMyfQ.TKxEG4taUb2_CR9CeNO6Ht0uLniUSNog2tqQOMhr2Rc"
  }
 */
router.get(function (req, res) {
    const token = jwt.sign({ id: generateUUID() }, jwtconfig.secret, {
        expiresIn: one_day,
        algorithm: jwtconfig.algorithm
    });

    res.json({
        success: true,
        message: 'Token issued successfully!',
        token: token
    });
});

/**
 * @api {delete} /token/:token Blacklist a token
 * @apiName DeleteToken
 * @apiGroup Token
 * @apiParam{string}token The token to invalidate
 * @apiSuccess{string}message A success message
 */
router.delete("/:token", function (req, res) {
    const token = req.params.token;

    const decodedToken = jwt.verify(req.query.token, jwtconfig.secret)

    const tokenObj = new Token();
    tokenObj.id = decodedToken.id;

    tokenObj.save(function (err) {
        if (err) {
            logger.error(`Token blacklist failed with error: ${err}`);
            res.status(500).send("Session invalidation failed!");
        }
        res.json({ message: 'Session successfully invalidated!' });
    });
});

module.exports = router;