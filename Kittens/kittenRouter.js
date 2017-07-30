'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Kitten = require('./kitten.js');
const logger = require('../logger.js');
const internal_server_error = 500;

router.route("")
    .post(function (req, res) {
        let kitten = new Kitten();
        kitten.name = req.query.name;

        kitten.save(function (err) {
            if (err) {
                logger.error(`Query failed with error: ${err}`)
                res.status(internal_server_error).send("Error! Kitten creation failed!");
            }
            res.json({ message: 'Kitten created!' });
        });
    })
    .get(function (req, res) {
        const pageSize = parseInt(req.query.pageSize) || 5;

        const last_comment_id = ObjectId.isValid(req.query.index) ? new ObjectId(req.query.index) : null;

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
            logger.error(`Query failed with error: ${err}`)
            res.status(internal_server_error).send("Error! Kitten retrieval failed!");
        });
    });


router.get("/:kitten_name_filter", function (req, res) {
    const regex = new RegExp(`.*${req.params.kitten_name_filter}.*`, "i"); // TODO: refactor with query builder
    var kittenQuery = Kitten.find({ name: regex }).exec();

    kittenQuery.then((err, kittens) => {
        res.json(kittens);
    }).catch(err => {
        logger.error(`Query failed with error: ${err}`)
        res.status(internal_server_error).send("Error! Kitten retrieval failed!");
    });;
});
module.exports = router;