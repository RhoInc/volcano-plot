"use strict";

/**
 * Database
 */
var config      = require('../../db/config');  
var env         = process.env.NODE_ENV;
var knex        = require('knex')(config[env]);

module.exports = knex;

knex.migrate.latest([config]); 
