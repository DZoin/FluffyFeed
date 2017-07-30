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