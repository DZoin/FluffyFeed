'use strict';

const express = require('express');
const router = express.Router();
const Kitten = require('./kitten.js');

router.route("")
    .post(function(req, res) {
        let kitten = new Kitten();
        kitten.name = req.body.name;  // set the kitten's name (comes from the request)

        kitten.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Kitten created!' });
        });
    })
    .get(function(req, res) {
        Kitten.find(function(err, kittens) {
            if (err)
                res.send(err);
            res.json(kittens);
        });
    });
    router.get("/:kitten_name_filter", function(req, res) {
        const regex = new RegExp(`.*${req.params.kitten_name_filter}.*`, "i");
        Kitten.find({name: regex})
            .exec((err, kittens) => {
                if (err)
                    res.send(err);

                res.json(kittens);
            });
    });
module.exports = router;