'use strict';

const log = require('winston').loggers.get('app');
const BaseModel = require('./base');

class ConfigModel extends BaseModel {

  constructor() {
    super();
    this.name = 'Config';
    this.table = 'configs';
    this.requiredFields = [];
  }

  getConfig(db, setid) {
    return this.getRelById(db, setid, ConfigModel);
  }

}

module.exports = new ConfigModel();

