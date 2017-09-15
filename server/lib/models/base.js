'use strict';

const log = require('winston').loggers.get('app');
const EventEmitter = require('events');
const util = require('util');

class BaseModel extends EventEmitter {

  constructor() {
    super();
    this.name = '';
    this.table = '';
    this.requiredFields = [];
    this.linking_tables = [];

    this.on('error', err => {
      log.debug(`Event error. Msg is ${err}`);
    });
  }

  /**
   * how others refer to us, convention is lowername_id
   */
  refId() {
    return this.name.toLowerCase() + '_id';
  }

  /**
   * stub to validate an object is valid.
   * returns true or a list of errors
   */
  validate(obj) {
    let failures = [];

    // base check: required fields //
    let missingReqs = [];
    this.requiredFields.forEach((f) => { if (!obj[f]) { missingReqs.push(f); }});;
    if (missingReqs.length > 0) {
      let err = 'Missing required fields: ' + missingReqs.join(',');
      failures.push(err);
    }

    return (failures.length == 0) ? true : failures; 
  }

  list(db) {
    return this.listFiltered(db, {});
  }

  listFiltered(db, where) {
    return new Promise((resolve, reject) => {

      //log.debug(`asking db about ${this.table} where ` + JSON.stringify(where, null, 2));
      return db(this.table)
          .where(where)
          .select('*')
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        log.warn(`listFiltered: error: ${err}`);
        reject(err);
      });

    });
  }

  /**
   * shortcut for tables directly linked to this one
   * if want bars related to foos and bars has a foo id
   *   rel_table = 'bars', ref_field = 'foo_id'
   */
  listRelsById(db, id, rel_table, ref_field=this.refId()) {
    return new Promise((resolve, reject) => {

      log.debug(`asking db about ${rel_table} where ${ref_field} = ${id}`);

      let where = {};
      where[ref_field] = parseInt(id);

      log.debug('qs:' + db(rel_table).where(where).select('*').toString());

      return db(rel_table)
          .where(where)
          .select('*')
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        log.debug(`listByRef: ${this.table}-${rel_table}.${ref_field} error: ${err}`);
        reject(err);
      });

    });
  }

  /**
   * shortcut for rels with linking tables: if bars related to foos via linking table 'foo_bars'
   *   relModel = new BarModel()
   */
  listRelsByLink(db, id, relModel) {
    return new Promise((resolve, reject) => {

      if (!relModel || !relModel.linking_tables[this.table])
        return [];

      let rel_table = relModel.table;
      let link_table = relModel.linking_tables[this.table];
      let link_us = link_table + '.' + this.refId();
      let link_them = link_table + '.' + relModel.refId();

      log.debug(`asking db about ${rel_table} via ${link_table} where ${this.refId()} = ${id}`);

      let where = {};
      where[link_us] = parseInt(id);

      log.debug('qs:' + db.from(rel_table).innerJoin(link_table, rel_table+'.id', link_them).where(where).toString());

      db.from(rel_table)
          .innerJoin(link_table, rel_table+'.id', link_them)
          .where(where)
      .then((rows) => {
        resolve(rows);
      })
      .catch((err) => {
        log.debug(`listRelsByLink: error: ${err}`);
        reject(err);
      });
    });
  }

  /**
   * shortcut: assumes model.refId() will be in us
   */
  getRelById(db, id, model) {
    return new Promise((resolve, reject) => {

      return this.getById(db, id)
      .then((o) => {
        if (o)
          resolve(model.getById(db, o[model.refId()]));
        else
          resolve(null);
      });

    });
  }

  getOne(db, where) {
    return this.listFiltered(db, where)
    .then((rows) => {
      return (rows) ? rows[0] : null;
    });
  }

  getById(db, id) {
    return this.getOne(db, {id: parseInt(id)});
  }

  query(db, qs, vals) {
    return new Promise((resolve, reject) => {

      reject('nyi');
      return;

    });
  }

  /**
   * add a new object
   */
  add(db, obj) {
    return new Promise((resolve, reject) => {
 
      if (obj._id) {
        reject('attempting to add an object that has an id defined');
        return;
      }

      log.debug('proposed new obj: ' + JSON.stringify(obj, null, 2));

      return this.save(db, null, obj)
      .then(savedObj => {

        resolve(savedObj);

      })
      .catch( err => {
    
        log.debug(`base add error: ${err}`);
        reject(err); 

      });
    
    });
  }

  /**
   * update the specified object by setting the properties defined
   */
  update(db, id, changes) {
    return new Promise((resolve, reject) => {
  
      this.getById(db, id)
      .then( obj => {

        // whoa there, sparky //
        delete changes['_id'];

        let newObj = Object.assign(obj, changes);
        //log.debug('merged obj: ' + JSON.stringify(newObj, null, 2));

        return this.save(db, id, newObj)
        .then( savedObj => { resolve(savedObj); });

      });

    })
    .then( newObj => {

      //log.debug('base update: heading out with ' + JSON.stringify(newObj, null, 2));
      return newObj;

    })
    .catch( err => {
    
      log.error(`base update error: ${err}`);
      reject(err); 

    });
  }

  save(db, id, obj) {
    return new Promise((resolve, reject) => {

      log.debug(`saving ${this.table} id ${obj._id}`);

      let valResult = this.validate(obj);
      if (valResult !== true) {
        log.debug('object failed validation check');
        reject(valResult);
        return;
      }

      reject('nyi');
    });
  }

  /**
   * remove all records from the given collection
   */
  deleteAll(db) {
    return new Promise((resolve, reject) => {

      reject('nyi');

    });
  }

  query(qs, vals) {
    return new Promise((resolve, reject) => {

      reject('nyi');
      return;

    });
  }

  /**
   * helper function to filter results given a filter object
   * and optional list of properties to keep/remove
   */
  filterObjList(list, filter=null, incprops=[], excprops=[]) {
    if (!list)
      return list;

    let finlist = [];
    for (let item of list) {
      let keep = true;
      if (filter) {
        for (let oprop in filter) {
          if (!item.hasOwnProperty(oprop))
            continue;
          if (item[oprop] != filter[oprop])
            keep = false;
        }
      }
      if (keep) {
        let finitem = item;
        if (incprops && incprops.length) {
          finitem = {};
          for (let prop of incprops) {
            if (item.hasOwnProperty(prop))
              finitem[prop] = item[prop];
          }
        }
        else if (incprops && incprops.length) {
          for (let prop of excprops) {
            if (item.hasOwnProperty(prop))
              delete finitem[prop];
          }
        }
        finlist.push(finitem);
      }
    }
    return finlist;
  }

}

module.exports = BaseModel;

