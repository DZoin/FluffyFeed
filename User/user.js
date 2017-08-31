'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema   = new Schema({
    username: String,
    passwordHash: String
});

module.exports = mongoose.model('User', TokenSchema);