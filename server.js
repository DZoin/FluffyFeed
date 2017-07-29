"use strict";

const express = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const config = require('./config.json');

const Kitten = require('./Models/kitten');

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: 'info' }),
      new (winston.transports.File)({
        filename: './Logging/general.log',
        level: 'info' //should be set through the ENV
      })
    ]
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
