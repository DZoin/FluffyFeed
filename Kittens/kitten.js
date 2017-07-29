'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var KittenSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Kitten', KittenSchema);