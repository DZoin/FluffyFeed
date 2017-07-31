'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const fse = require('fs-extra');
var im = require('imagemagick');

const ImagePathBuilder = require('../Utils/imagePathBuilder.js');
const uuid = require('../Utils/uuid.js');

const Kitten = require('./kitten.js');
const logger = require('../logger.js');
const internal_server_error = 500;
const bad_request = 400;
const created = 201;
const defaultPageSize = 10;

/**
 * @api {post} /api/kitten Create a kitten profile
 * @apiName PostKitten
 * @apiGroup Kitten
 * @apiParam{string}Name The name of the kitten. Must be passed as x-www-form-urlencoded
 * @apiParam{string}token [Header] "Authorization: Bearer \<token\>" [Header]The issued JWT access token during the login procedure
 */
router.post("", function (req, res) {
    const kitten = new Kitten();
    if(!req.body.name) {
        logger.info(`Kitten name is empty`);
        res.status(bad_request).send("Bad request! Kitten name cannot be empty!");
    }
    kitten.name = req.body.name;

    if(req.files.photo) {
        const id = uuid();
        const fileExtension = req.files.photo.path.split('.').pop();
        const imagePathBuilder = new ImagePathBuilder('images', id, fileExtension);
        
        fse.copy(req.files.photo.path, imagePathBuilder.filePath())
            .then(() => {
                im.resize({
                    srcPath: imagePathBuilder.filePath(),
                    dstPath: imagePathBuilder.thumbnailPath(),
                    width:   256
                }, function(err, stdout, stderr){
                if (err) throw err;
                logger.info(`resized ${imagePathBuilder.fileName()} to fit within 256x256px`);
                });
                kitten.image_uri = imagePathBuilder.thumbnailUri(req);
            })
            .then(()=> {
                kitten.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    res.status(created).json({ message: 'Kitten created!' });
                });
            })
            .catch(err => {
                logger.error(`Kitten creationf failure with error: ${err}`);
                res.status(internal_server_error).send("Error! Kitten creation failed!");
            });      
    }   
});
/**
 * @api {get} /api/kitten/:pagesize?/:index? Request kitten feed
 * @apiName GetKitten
 * @apiGroup Kitten
 * @apiParam{int}Pagesize [Optional]The number of items inside the response. Default value 5
 * @apiParam{string}Index [Optional]The index of the last viewed item.
 *  Passing this parameter fetches the next page of the feed.
 * @apiParam{string}name_filter [Optional]The results will be filtered if they do not contain the provided string.
 * The comparison ignores case. WARNING: This call does not utilize the database indexing and might result in slower
 * processing if the dataset is sufficiently large.
 * @apiParam{string}token [Header] "Authorization: Bearer \<token\>" [Header]The issued JWT access token during the login procedure
 * @apiSuccess{Array}kittens Array of Kitten objects
 * @apiSuccess{int}pageSize [Optional]Current pagination size. Default value 10
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
    const pageSize = parseInt(req.params.pagesize) || defaultPageSize;

    const last_comment_id = ObjectId.isValid(req.params.index) ? new ObjectId(req.params.index) : null;

    let kittenQuery = null;
    if(req.query.name_filter) { // The unfiltered query is indexed and therefor much faster
        const regex = new RegExp(`.*${req.query.name_filter}.*`, "i");

        if (last_comment_id) {
            kittenQuery = Kitten.find({name: regex})
                .where("_id").gt(last_comment_id)
                .limit(pageSize)
                .exec();

        } else {
            kittenQuery = Kitten.find({name: regex}).limit(pageSize).exec();
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
    } else {
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
    }
});

module.exports = router;