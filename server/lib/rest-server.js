'use strict';

const express = require('express');
const rest = express.Router();
const path = require('path');

// ### define api endpoints ###

// if a request is made to the api endpoint send back a json file documenting the REST API
rest.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './routes', 'api.json'));
});

// to enable monitoring of application status
rest.get('/ping', function (req, res) {
  res.status(200).json({message: 'pong'});
});

const datasets = require('./routes/datasets.js');
rest.use('/datasets', datasets.router);

module.exports = rest;
