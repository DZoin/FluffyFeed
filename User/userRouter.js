'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const logger = require('../logger.js');
const jwtconfig = require('../Config/jwtconfig.json');
const Token = require('./token.js');
const User = require('./user.js');
const generateUUID = require('../Utils/uuid.js');
const router = express.Router();
const one_day = 1440;
const bad_request = 400;
const saltRounds = 10


/**
 * @api {post} /user/register Register user
 * @apiName Register
 * @apiGroup Authentication
 * @apiParam{string}username [Body]Desired username
 * @apiParam{string}password [Body]Desired password
 * @apiSuccessExample Success example
 * 
 * {
    "message": "User created!"
   }
*/
router.post("/register", function (req, res) {
    if (!req.body.username && !req.body.password) {
        res.status(bad_request).send();
    }

    const user = new User();
    user.username = req.body.username
    bcrypt.hash(req.body.password, saltRounds)
        .then(function (hash) {
            user.passwordHash = hash;
            user.save(function (err) {
                if (err) {
                    logger.error(`User creation -- DB operation failed: ${err}`);
                    res.status(500).send("User creation failed!");
                }
                res.json({ message: 'User created!' });
            });
        });
});

/**
 * @api {post} /user/login Receive JWT access token
 * @apiName Login
 * @apiGroup Authentication
 * @apiParam{string}username [Body]Username
 * @apiParam{string}password [Body]Password
 * @apiSuccessExample Success example
 * {
    "success": true,
    "message": "Token issued successfully!",
   }
*/
router.post("/login", function (req, res) {
    if (!req.body.username && !req.body.password) {
        res.status(bad_request).send();
    }

    const userQuery = User.findOne()
        .where("username").eq(req.body.username)
        .exec();

    userQuery.then(user => {
        if(!user) {
            res.status(401).send("Incorrect user credentials!");
        }
        bcrypt.compare(req.body.password, user.passwordHash).then(function (isEqual) {
            if (!isEqual) {
                res.status(401).send("Incorrect user credentials!");
            }

            const token = jwt.sign({ id: generateUUID() }, jwtconfig.secret, {
                expiresIn: one_day,
                algorithm: jwtconfig.algorithm
            });

            res.setHeader("token", token);
            res.json({
                success: true,
                message: 'Token issued successfully!'
            });
        });
    });
});
/**
 * @api {post} /user/logout/:token Revoke access token
 * @apiName Logout
 * @apiGroup Authentication
 * @apiParam{string}token [Header]The issued JWT access token during the login procedure
 * @apiSuccessExample Success example
 * {
    "message": "Session successfully invalidated!"
   }
*/
router.post("/logout", function (req, res) {
    if(!req.headers.token) {
        res.status(400).send("Session invalidation failed! No token present in header");
    }
    const decodedToken = jwt.verify(req.headers.token, jwtconfig.secret);
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