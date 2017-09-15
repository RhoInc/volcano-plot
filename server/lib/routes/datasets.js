'use strict';

const log = require('winston').loggers.get('app');
const config = require('config');
const fs = require('fs');
const path = require('path');
const DataUtils = require('../utils/data_utils');
const cjConverter = require('csvtojson').Converter;

let BaseRoute = require('./base');
const datasetModel = require('../models/dataset');
const adminMethods = [];

class DatasetsRoute extends BaseRoute {

  constructor(model, adminMethods) {
    super(model, adminMethods);

    this.getHeaders = this.getHeaders.bind(this);
    this.getData = this.getData.bind(this);
    this.headData = this.headData.bind(this);

    this.router.get('/:id/headers', this.getHeaders);
    this.router.get('/:id/data(.:format([a-z0-9]+))?', this.getData);
    this.router.get('/:id/head(.:format([a-z0-9]+))?(/:count)?', this.headData);
  }

  /**
   * accept a posted object add
   * returns created object on success
   */
  add(req, res, next) {
    if (req.params.id) {
      req.util.sendBadRequest(res, 'id cannot be present in add request');
      return;
    }
    if (!req.files) {
      return req.util.sendBadRequest(res, 'no file specified.');
    }

    log.debug('add raw: ' + JSON.stringify(req.body, null, 2));

    this.model.add(req.db, req.body, req.files || null)
    .then( newObj => {
      req.util.sendJSONObject(res, newObj);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  /**
   * accept a put/patch/post update
   * returns updated object on success
   */
  update(req, res, next) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, 'id missing from request');
      return;
    }

    this.model.update(req.db, req.params.id, req.body, req.files || null)
    .then( newObj => {
      req.util.sendJSONObject(res, newObj);
    }).catch( err => {
      req.util.sendError(res, err);
    });
  }

  postFile(req, res, next) {
    // could end up with a new id, or an existing one //
    let finalid = null;


    // study required //
    if (!req.body.studyId) {
      return req.util.sendBadRequest(res, 'Study missing from request');
    }

    // we're a file uploader. no file, no upload. //
    if (!req.files) {
      return req.util.sendBadRequest(res, 'No file specified.');
    }

    let fileKey = Object.keys(req.files)[0];
    let file = req.files[fileKey];

    this.model.saveFromPost(req.db, req.body, file)
    .then( df => {

      if (df)
        req.util.sendJSONObject(res, df);
      else
        req.util.sendBadRequest(res, `File did not match a known data specification`);

    }).catch( err => {

      req.util.sendError(res, err);

    });

  }

  /**
   * parse the start of the raw csv to get the headers
   */
  getHeaders(req, res, next) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, 'id missing from request');
      return;
    }

    this.model.getDataPath(req.db, req.params.id)
    .then( path => {

      DataUtils.headFile(path, 2)
      .then( lines => {

        if (!lines) {
          req.util.sendNotFound(res);
          return;
        }

        let cj = new cjConverter({flatKeys: true});
        cj.fromString(lines.join('\r\n'))
        .on('end_parsed', jArr => {
          req.util.sendJSONArray(res, Object.getOwnPropertyNames(jArr[0]));
        });
      });

    });
  }

  /**
   * stream data tied to the specified dataset
   *
   */
  getData(req, res, next) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, 'id missing from request');
      return;
    }

    // check for optional format suffix (hardcoded choices for now) //
    let responseFormat = 'csv';
    if (req.params.format && req.params.format == 'json')
      responseFormat = 'json';

    this.model.getById(req.db, req.params.id)
    .then( dataset => {

      if (!dataset) {
        req.util.sendNotFound(res);
        return;
      }

      // stream the version of the file requested: try/catch because fs calls can be mean //
      try {
        this.model.getDataStream(req.db, dataset.id)
        .then( rawStream => {
          if (!rawStream) {
            req.util.sendNotFound(res);
            return;
          }

          let headers = { 'Content-Type': 'text/plain' };

          if (responseFormat == 'json') {
            let cj = new cjConverter({flatKeys:true, constructResult:false, toArrayString:true});
            res.writeHead(200, headers);
            rawStream.pipe(cj).pipe(res);
          } else {
            res.writeHead(200, headers);
            rawStream.pipe(res);
          }

          res.on('error', err => {
            rawStream.end();
            log.err(`data: ${err}`);
            reject('file streaming error');
          });
          rawStream.on('close', err => {
            if (err) log.err(`data: ${err}`);
            return;
          });
        });
      } catch (err) {
        log.warn(`file stream failure on ${dataset.code}.${responseFormat}: ${err}`);
        reject(err);
      }

    })
    .then( null, err => { req.util.sendError(res, err); } )
    .catch( err => {
      req.util.sendError(res, err);
    });
  }

  /**
   * return the first N records
   */
  headData(req, res, next) {
    if (!req.params.id) {
      req.util.sendBadRequest(res, 'id missing from request');
      return;
    }

    let responseFormat = 'csv';
    if (req.params.format && req.params.format == 'json')
      responseFormat = 'json';

    let lineCount = (parseInt(req.params.count) || 10) + 1;

    this.model.getDataPath(req.db, req.params.id)
    .then( path => {

      let headers = { 'Content-Type': 'text/plain' };

      DataUtils.headFile(path, lineCount)
      .then( lines => {
        if (!lines) {
          req.util.sendNotFound(res);
          return;
        }

        let lineStr = lines.join('\r\n');
        if (responseFormat == 'json') {
          let cj = new cjConverter({flatKeys: true, toArrayString:true});
          res.writeHead(200, headers);
          cj.fromString(lineStr).pipe(res);
          /*
          .on('end_parsed', jArr => {
            req.util.sendJSONArray(res, jArr);
          });
           */
        } else {
          res.end(lineStr);
        }
      })
      .catch( err => {
        req.util.sendError(res, `head: ${err}`);
      });

    });
  }

}

module.exports = new DatasetsRoute(datasetModel, adminMethods);
