'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../logger.js');
const router = express.Router();

router.get("/:name", function (req, res) {
    const html = `<img src="/${req.params.name}?token=${req.query.token}" />`

    res.send(html);
});

module.exports = router;
