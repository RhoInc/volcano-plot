'use strict';

const log = require('winston').loggers.get('app');
const config = require('config');
const fs = require('fs');
const path = require('path');
const DataUtils = require('../utils/data_utils');

const BaseModel = require('./base');

class DatasetModel extends BaseModel {

  constructor() {
    super();
    this.name = 'Dataset';
    this.table = 'datasets';
    this.requiredFields = [];
  }

  getConfig(db, id) {
    return this.getRelById(db, id, ConfigModel);
  }

  getDataDir(db, id) {
    return new Promise((resolve, reject) => {
    
      return this.getById(db, id)
      .then( dataset => {
        resolve(path.resolve(path.join(config.get('data.path'), id.toString())));
      });

    });
  }

  getDataPath(db, id, type='raw') {
    return new Promise((resolve, reject) => {
    
      return this.getDataDir(db, id)
      .then( dataDir => {
        resolve(path.join(dataDir, type));
      });

    });
  }

  getDataStream(db, id, type='raw') {
    return new Promise((resolve, reject) => {
    
      return this.getDataPath(db, id, type)
      .then( dataPath => {
        if (!DataUtils.readable(dataPath)) {
          log.info(`could not access file for dataset ${id}`); 
          resolve(null);
        }

        resolve(fs.createReadStream(dataPath, {encoding: 'utf8'}));
      });
    });
  }

  add(db, obj, upfile) {
    return new Promise((resolve, reject) => {

      if (!upfile) {
        reject('no file found to save');
        return;
      }

      obj.dt_uploaded = new Date();
      obj.original_filename = upfile.filename;
      super.add(db, obj)
      .then( savedObj => {

        if (!savedObj) {
          reject('save failure');
          return;
        }

        this.saveUploadedFile(savedObj.id, upfile)
        .then( success => {
          resolve(savedObj);
        });

      })
      .catch( err => {
        log.debug(`ds add error: ${err}`);
        reject(err); 
      });
    
    });
  }

  update(db, id, changes, upfile) {
    return new Promise((resolve, reject) => {

      if (upfile) {
        changes.dt_uploaded = new Date();
        changes.original_filename = upfile.filename;
      }

      super.update(db, id, changes)
      .then( savedObj => {

        if (!upfile) {
          resolve(savedObj);
          return;
        }

        this.saveUploadedFile(savedObj.id, upfile)
        .then( success => {
          resolve(savedObj);
        });

      })
      .catch( err => {
        log.debug(`ds update error: ${err}`);
        reject(err); 
      });
    
    });
  }

  /**
   * FIXME: no error checking, all synchronous calls
   */
  saveUploadedFile(dirname, upfile) {
    return new Promise((resolve, reject) => {

      if (!fs.existsSync(upfile.file)) {
        reject('source file not found');
        return;
      }

      // first upload may not have a base folder //
      if (!fs.existsSync(config.get('data.path')))
        fs.mkdirSync(config.get('data.path'));

      let targetDir = path.join(config.get('data.path'), dirname.toString());
      if (!fs.existsSync(targetDir))
        fs.mkdirSync(targetDir);

      let targetPath = path.join(targetDir, 'raw');
      //log.debug(`saving from ${upfile.file} to ${targetPath}`);

      require('fs-extra').copySync(upfile.file, targetPath);
      resolve(targetPath);

    });
  }

}

module.exports = new DatasetModel();

// cross-model dependencies //
const ConfigModel = require('./config');

