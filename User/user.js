'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema   = new Schema({
    username: String,
    passwordHash: String
});

module.exports = mongoose.model('User', TokenSchema);