"use strict";

const express = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');

const logger = require('./logger.js');
const config = require('./Config/dbconfig.json');
const kittenRouter = require('./Kittens/kittenRouter.js');
const jwtMiddleware = require('./Authentication/jwtMiddleware.js');

// TO DO: Logs must output structured, pretty printed JSON literals.
// JSON.stringify() outpus too complex json with mongoose objects (override toString?)


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
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}}",
      expressFormat: true,
      colorize: true
}));

//Routing
const port = process.env.PORT || 8080;

app.use(jwtMiddleware);
app.use("/api/kittens", kittenRouter);

// Db connection
// TODO: Plugin promise library http://mongoosejs.com/docs/promises.html
mongoose.connect(`mongodb://${config.dbowner}:${config.dbpass}@${config.dbhost}/${config.dbname}`, {
  useMongoClient: true
}).then(()=> {
    // Server start
    app.listen(port);
    logger.info(`Server started! Listening on port: ${port}`);
}).catch(()=> {
    logger.err(`DB Initialization failed: ${err}`); // TO DO: investigate why catch does not work
});
