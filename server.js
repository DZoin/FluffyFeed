"use strict";

var express = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
const winston = require('winston');
const config = require('./config.json');

var Kitten = require('./Models/kitten');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'info' }),
      new (winston.transports.File)({
        filename: './Logging/general.log',
        level: 'info' //should be set through the ENV
      })
    ]
  });

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routing
var port = process.env.PORT || 8080;
var router = express.Router();

// Basic middleware
router.use(function(req, res, next) {
    logger.info("Inside middleware");
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/kitten')
    .post(function(req, res) {
        let kitten = new Kitten();
        kitten.name = req.body.name;  // set the kitten's name (comes from the request)

        kitten.save(function(err) {
            if (err) {
                res.send(err);
            }
            
            res.json({ message: 'Kitten created!' });
        });
    });

app.use('/api', router);

// Db connection
// TODO: Plugin promise library http://mongoosejs.com/docs/promises.html
// mongodb://${config.username}:${config.password}@${config.dbhost}/${config.dbname}

mongoose.connect(`mongodb://${config.dbowner}:${config.dbpass}@${config.dbhost}/${config.dbname}`, {
  useMongoClient: true
}).then(()=> {
    // Server start
    app.listen(port);
    // Test logging
    logger.info(`Magic happens on port ${port}`);
}).catch(()=> {
    logger.err(`DB Initialization failed: ${err}`);
});
