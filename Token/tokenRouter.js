'use strict';

const express = require('express');
var jwt = require('jsonwebtoken');
const jwtconfig = require('../Config/jwtconfig.json');
const router = express.Router();
const one_day = 1440;

router.route("")
    .get(function(req, res) {
        var token = jwt.sign({}, jwtconfig.secret, {
          expiresIn: one_day,
          algorithm: jwtconfig.algorithm
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
    });
    
module.exports = router;