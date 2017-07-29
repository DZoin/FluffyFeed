"use strict";

const express = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const config = require('./config.json');

const Kitten = require('./Models/kitten');

// TO DO: Logs must output structured, pretty printed JSON literals.
// JSON.stringify() outpus too complex json with mongoose objects (override toString?)
const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ 
        level: 'info',
        json: false,
        colorize: true
    }),
      new (winston.transports.File)({
        filename: './Logging/general.log',
        level: 'info', //should be set through the ENV
        json: false
      })
    ]
  });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ],
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true
}));

//Routing
const port = process.env.PORT || 8080;
const router = express.Router();

// Basic middleware
router.use(function(req, res, next) {
    logger.info("Inside middleware");
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/kittens')
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

router.route('/kittens/:kitten_name_filter')
    .get(function(req, res) {
        const regex = new RegExp(`.*${req.params.kitten_name_filter}.*`, "i");
        Kitten.find({name: regex})
            .exec((err, kittens) => {
                if (err)
                    res.send(err);

                res.json(kittens);
            });
    });

app.use('/api', router);

// Db connection
// TODO: Plugin promise library http://mongoosejs.com/docs/promises.html
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
