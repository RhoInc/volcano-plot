'use strict';

const log = require('winston').loggers.get('app');
var config = require('config');
var util = require('util');

var BaseModel = require('../models/base');

class BaseRoute {

  constructor(model, adminMethods) {
    this.router = require('express').Router();
    this.model = model;
    this.adminMethods = adminMethods || [ 'DELETE' ];

    // attach any route class specific items //
    this.attachBling = this.attachBling.bind(this);
    this.router.use(this.attachBling);

    // attach middleware common across routes //
    this.router.use(noCacheHeaders);
    this.router.use(adminMethodCheck);

    // attach endpoints //
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);

    this.router.get('/', this.list);
    this.router.get('/:id', this.getById);
    this.router.post('/', this.add);
    this.router.put('/:id', this.update);
    this.router.patch('/:id', this.update);
  }

  attachBling(req, res, next) {
    req.model = this.model;
    req.adminMethods = this.adminMethods;
    next();
  }

  list(req, res) {
    this.model.list(req.db)
    .then( list => {
      req.util.sendJSONArray(res, list);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  getById(req, res) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, "id missing from request");
      return;
    }

    this.model.getById(req.db, req.params.id)
    .then( obj => {
      if (!obj)
        req.util.sendNotFound(res);
      else
        req.util.sendJSONObject(res, obj);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  /**
   * for reference from us to linked object
   */
  getRelatedOne(req, res, modelfunc) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, "id missing from request");
      return;
    }
    if (!modelfunc || !this.model[modelfunc]) {
      req.util.sendError(res, "invalid relation specified");
      return;
    }

    this.model[modelfunc](req.db, req.params.id)
    .then( obj => {
      if (obj)
        req.util.sendJSONObject(res, obj);
      else
        req.util.sendNotFound(res);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  /**
   * for list of links related to us
   */
  listRelated(req, res, modelfunc, filter) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, "id missing from request");
      return;
    }
    if (!modelfunc || !this.model[modelfunc]) {
      req.util.sendError(res, "invalid relation specified");
      return;
    }

    this.model[modelfunc](req.db, req.params.id, filter)
    .then( list => {
      req.util.sendJSONArray(res, list);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  /**
   * accept a posted object add
   * returns created object on success
   */
  add(req, res, next) {
    if (req.params.id) {
      req.util.sendBadRequest(res, "id present in add request");
      return;
    }

    log.debug('add raw: ' + JSON.stringify(req.body, null, 2));

    this.model.add(req.db, req.body)
    .then( newObj => {
      req.util.sendJSONObject(res, newObj);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  /**
   * accept a put/patch update
   * returns updated object on success
   */
  update(req, res, next) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, "id missing from request");
      return;
    }

    this.model.update(req.db, req.params.id, req.body)
    .then( newObj => {
      req.util.sendJSONObject(res, newObj);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

}

/**
 * some verbs are only for grownups
 */
function adminMethodCheck(req, res, next) {
  if (req.username && req.session.user.admin) {
    return next();
  }

  if (req.adminMethods.includes(req.method)) {
    if (req.username)
      log.info(`Non-admin ${req.username} attemped to ${req.method} to ${req.model.name}`);
    req.util.sendForbidden(res);
    return;
  }

  next();
}

/**
 * all api calls are non-caching 
 */
function noCacheHeaders(req, res, next) { 
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  //log.debug(`no cache headers set`);
  next();
}

module.exports = BaseRoute;

