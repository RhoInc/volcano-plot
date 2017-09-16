'use strict';

const config = require('config');

const logs = require('./log')(true);
const log = logs.get('app');

const uuidv5 = require('uuid/v5');

const express = require('express');
const app = express();
let server = require('http').createServer(app);


// request i/o //
const bb = require('express-busboy');
bb.extend(app, { upload: true });

const compress = require('compression');
app.use(compress());
app.set('json spaces', 2);

// allow cross-domain by default //
app.use(allowCrossDomain);

// favicon support //
/*
const path = require('path');
const favicons = require('connect-favicons');
const favpath = path.join(__dirname, '../../client', 'images', 'favicon');
app.use(favicons(favpath));
 */

//-- routing --//

// preproc: helpers //
let db = require('./db');
app.use( (req, res, next) => {
  req.db = db;
  req.util = require('./utils/response_utils.js');

  // base api url for self-referencing //
  req.getBaseAPIUrl = function () {
    return req.protocol + '://' + req.get('Host') + config.get('server.apiroot');
  }

  req.uuid = uuidv5(req.url, uuidv5.URL);

  log.debug('preproc: raw url %s %s', req.method, req.url);
  next();
});

// attach routes //
let routes = require('./routes')(app);

// post-routing: catch 404s and errors //
app.use(function(req, res, next) {
  var err = new Error(req.url + ' Not Found');
  err.status = 404;
  next(err);
});

// more error details if not prod //
if (app.get('env') !== 'production') {
  app.use(function(err, req, res, next) {
    var errstatus = err.status || 500;
    if (errstatus != 404)
      log.info('server error %s: url %s, msg %s', errstatus, req.url, err.message);
    if (!res.headersSent) {
      res
        .status(err.status || 500)
        .json({
          message: err.message,
          error: err
        });
    } else {
      res.end();
    }
  });
}

app.use(function(err, req, res, next) {
  var errstatus = err.status || 500;
  log.debug("final error handler: %s.%s", err.status, err.message);
  if (!res.headersSent) {
    res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: {}
      });
  } else {
    res.end();
  }
});

// url passthru if not prod //
if (app.get('env') !== 'production') {
  app.use(function(req, res, next) {
    log.debug('routing: url %s', req.url);
    next();
  });
}

// start the server //
server.listen(config.get('server.port'), function () {
  var port = this.address().port;
  log.info('\nListening on port %s, running as env %s', port, app.get('env'));
});

function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
}

module.exports = app;
