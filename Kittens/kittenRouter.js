'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Kitten = require('./kitten.js');
const logger = require('../logger.js');
const internal_server_error = 500;
const bad_request = 400;

/**
 * @api {post} /api/kitten Create a kitten profile
 * @apiName PostKitten
 * @apiGroup Kitten
 * @apiParam{string}Name The name of the kitten. Must be passed as x-www-form-urlencoded
 */
router.post("", function (req, res) {
    const kitten = new Kitten();
    if(!req.body.name) {
        logger.info(`Kitten name is empty`);
        res.status(bad_request).send("Bad request! Kitten name cannot be empty!");
    }
    kitten.name = req.body.name;

    kitten.save(function (err) {
        if (err) {
            logger.error(`Query failed with error: ${err}`)
            res.status(internal_server_error).send("Error! Kitten creation failed!");
        }
        res.json({ message: 'Kitten created!' });
    });
});
/**
 * @api {get} /api/kitten/:pagesize?/:index? Request kitten feed
 * @apiName GetKitten
 * @apiGroup Kitten
 * @apiParam{int}Pagesize [Optional]The number of items inside the response. Default value 5
 * @apiParam{string}Index [Optional]The index of the last viewed item.
 * Passing this parameter fetches the next page of the feed.
 * @apiSuccess{Array}kittens Array of Kitten objects
 * @apiSuccess{int}pageSize Current pagination size
 * @apiSuccess{string}index [Optional]Index of last item. If not present end of feed has been reached
 * @apiSuccessExample Sample response
  {
    "kittens": [
        {
            "_id": "597c2c02f9ec57078e333e5a",
            "name": "MrFluff",
            "__v": 0
        },
        {
            "_id": "597c3448d5e87d1845e02dea",
            "name": "Roshko",
            "__v": 0
        }
    ],
    "pageSize": 2,
    "index": "597d75cc67e0f246367ca827"
    }
 */
router.get("/:pagesize?/:index?", function (req, res) {
    const pageSize = parseInt(req.params.pagesize) || 5;

    const last_comment_id = ObjectId.isValid(req.params.index) ? new ObjectId(req.params.index) : null;

    let kittenQuery = null;

    if (last_comment_id) {
        kittenQuery = Kitten.find()
            .where("_id").gt(last_comment_id)
            .limit(pageSize)
            .exec();

    } else {
        kittenQuery = Kitten.find().limit(pageSize).exec();
    }

    kittenQuery.then((kittens) => {
        const responseBody = {
            "kittens": kittens,
            "pageSize": pageSize
        }
        if (kittens.length == pageSize) {
            responseBody.index = kittens[kittens.length - 1]._id
        }
        res.json(responseBody);
    }).catch(err => {
        logger.error(`Query failed with error: ${err}`);
        res.status(internal_server_error).send("Error! Kitten retrieval failed!");
    });
});

module.exports = router;