'use strict';

const express = require('express');
const router = express.Router();
const bad_request = 400;

/**
 * @api {get} /api/image/:image_uri View kitten thumbnail
 * @apiName GetImage
 * @apiGroup Images
 * @apiParam{string}image_uri The uri to the thumbnail. Retrieved from the corresponding Kitten object
 */
router.get("/:image_uri", function (req, res) {
    if(req.params.image_uri.includes("/")) {
        res.status(bad_request).send("Error! Badly formed image uri");
    }
    const html = `<img src="/${req.params.image_uri}?token=${req.query.token}" />`

    res.send(html);
});

module.exports = router;
