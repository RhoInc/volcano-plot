'use strict';

/**
 * logging configuration
 */

const path = require('path');
const config = require('config');
let winston = require('winston');
require('winston-daily-rotate-file');
var logset = false;

module.exports = function( debug=false ) {

  // only init once //
  if (logset)
    return winston.loggers;

  // use syslog: tradition wins //
  winston.setLevels(winston.config.syslog.levels);

  let appTransports = [];

  // to disable a log, set logging.type = false in the config //
  let wantConsole = config.get('logging.console') ? true : false;
  let wantFile = config.get('logging.file') ? true : false;

  // main app log (but optional daily cycle) //
  let rotate = confor('logging.file.rotate-daily', false);
  let appTtype = rotate
      ? winston.transports.DailyRotateFile : winston.transports.File;

  // file log //
  if (wantFile) {
    let appLogOpts = {
      name: 'app-file',
      filename: path.join(confor('logging.file.path', '.'), confor('logging.file.filename', 'app.log')),
      level: confor('logging.file.minlevel', (debug) ? 'debug' : 'info'),
      json: confor('logging.file.json', true),
      timestamp: confor('logging.file.timestamp', true),
    };
    if (rotate)
      appLogOpts.datePattern = confor('logging.file.datepattern', '.YYYY-MM-dd');
    // catch exceptions here if no console //
    if (!wantConsole)
      appLogOpts.handleExceptions = true;

    let appTransport = new (appTtype)(appLogOpts);
    appTransports.push(appTransport);
  }

  // console log //
  if (wantConsole) {
    let conLevel = confor('logging.console.minlevel',
        (process.env.ENV === 'production') ? 'warn' : 'info');
    let conLogOpts = {
      name: 'app-console',
      level: (debug) ? 'debug' : conLevel,
      colorize: true,
      json: false,
      timestamp: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    };

    let consoleTransport = new (winston.transports.Console)(conLogOpts);
    appTransports.push(consoleTransport);
  }

  // no app logs = bit bucket //
  if (!wantFile && !wantConsole)
    appTransports.push(nullTransport);

  winston.loggers.add('app', { transports: appTransports });

  logset = true;

  return winston.loggers;

};

function confor(confstr, fallback) {
  return config.has(confstr) ? config.get(confstr) : fallback;
}
