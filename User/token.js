'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema   = new Schema({
    id: String
});

module.exports = mongoose.model('Token', TokenSchema);