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
    return new Promise( (resolve, reject) => {
    
      return this.getById(db, id)
      .then( dataset => {
        resolve(path.resolve(path.join(config.get('data.path'), dataset.code)));
      });

    });
  }

  getDataPath(db, id, type='raw') {
    return new Promise( (resolve, reject) => {
    
      return this.getDataDir(db, id)
      .then( dataDir => {
        resolve(path.join(dataDir, type));
      });

    });
  }

  getDataStream(db, id, type='raw') {
    return new Promise( (resolve, reject) => {
    
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

}

module.exports = new DatasetModel();

// cross-model dependencies //
const ConfigModel = require('./config');

