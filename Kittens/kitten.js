'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KittenSchema   = new Schema({
    name: String,
    image_uri: String
});

module.exports = mongoose.model('Kitten', KittenSchema);