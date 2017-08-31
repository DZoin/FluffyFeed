'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema   = new Schema({
    id: String
});

module.exports = mongoose.model('Token', TokenSchema);