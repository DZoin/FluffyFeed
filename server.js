"use strict";

const express = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const config = require('./Config/dbconfig.json');

const kittenRouter = require('./Kittens/kittenRouter.js');

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

app.use("/api/kittens", kittenRouter);

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
