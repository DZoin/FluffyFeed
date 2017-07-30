'use strict';

const express = require('express');
const app = module.exports = express();
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const logger = require('./logger.js');
const dbconfig = require('./Config/dbconfig.json');
const kittenRouter = require('./Kittens/kittenRouter.js');
const tokenRouter = require('./Token/tokenRouter.js');
const imageRouter = require('./Image/imageRouter.js');
const jwtMiddleware = require('./Authentication/jwtMiddleware.js');

// TO DO: Logs must output structured, pretty printed JSON literals.
// JSON.stringify() outpus too complex json with mongoose objects (override toString?)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multipartMiddleware);
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

app.use(express.static('images'));
app.use(jwtMiddleware);
app.use("/token", tokenRouter);
app.use("/api/kittens", kittenRouter);
app.use("/image", imageRouter);

// Db connection
// TODO: Plugin promise library http://mongoosejs.com/docs/promises.html
mongoose.connect(`mongodb://${dbconfig.dbowner}:${dbconfig.dbpass}@${dbconfig.dbhost}/${dbconfig.dbname}`, {
  useMongoClient: true
}).then(()=> {
    // Server start
    app.listen(port);
    logger.info(`Server started! Listening on port: ${port}`);
}).catch(()=> {
    logger.error(`DB Initialization failed: ${err}`); // TO DO: investigate why catch does not work
});
