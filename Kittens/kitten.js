'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KittenSchema   = new Schema({
    name: String,
    image_uri: String
});

module.exports = mongoose.model('Kitten', KittenSchema);