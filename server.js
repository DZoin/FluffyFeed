var express = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

var Kitten = require('./Models/kitten');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/api', router);

mongoose.connect('mongodb://localhost:27017');
app.listen(port);
console.log('Magic happens on port ' + port);