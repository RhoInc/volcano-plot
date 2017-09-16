'use strict';

const config = require('config');
const express = require('express');

/**
 * client and api routes
 */

module.exports = function(app) {

  // rest api //
  const rest = require('./rest-server.js');
  app.use(config.get('server.apiroot'), rest);

  // client-side //
  app.use(config.get('server.clientroot'), express.static('../client'));
  app.use('/build', express.static('../build'));
  app.use('/lib', express.static('../lib'));
  app.use('/css', express.static('../css'));

  // redirect root to the client //
  app.get('/', (req, res) => {
    res.redirect(config.get('server.clientroot'));
  });

}

