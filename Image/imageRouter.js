'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../logger.js');
const router = express.Router();

/**
 * @api {get} /api/image/:image_uri View kitten thumbnail
 * @apiName GetImage
 * @apiGroup Images
 * @apiParam{string}image_uri The uri to the thumbnail. Retrieved from the corresponding Kitten object
 */
router.get("/:image_uri", function (req, res) {
    const html = `<img src="/${req.params.image_uri}?token=${req.query.token}" />`

    res.send(html);
});

module.exports = router;
