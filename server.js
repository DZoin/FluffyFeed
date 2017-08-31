'use strict';

const express = require('express');
const app = module.exports = express();
const cors = require('cors');
//const corsconfig = require('./Config/corsconfig.json');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const logger = require('./logger.js');
const dbconfig = require('./Config/dbconfig.json');
const kittenRouter = require('./Kittens/kittenRouter.js');
const userRouter = require('./User/userRouter.js');
const imageRouter = require('./Image/imageRouter.js');
const jwtMiddleware = require('./Authentication/jwtMiddleware.js');


/*
const whitelist = corsconfig;

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/

app.options('*', cors());
app.use(cors()); // app.use(cors(corsOptions)); for production
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
app.use("/user", userRouter);
app.use("/api/kittens", kittenRouter);
app.use("/api/image", imageRouter);

// Db connection
mongoose.connect(`mongodb://${dbconfig.dbowner}:${dbconfig.dbpass}@${dbconfig.dbhost}/${dbconfig.dbname}`, {
  useMongoClient: true
}).then(()=> {
    // Server start
    app.listen(port);
    logger.info(`Server started! Listening on port: ${port}`);
}).catch(()=> {
    logger.error(`DB Initialization failed: ${err}`); // TO DO: investigate why catch does not work
});
