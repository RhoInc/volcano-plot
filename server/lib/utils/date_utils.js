'use strict';

const dateFormat = require('dateformat');
const Duration = require('duration');

class DateUtilities {

  static convertToLocalDate(date) {
    let localDate = new Date(date.toLocaleString());
    return localDate;
  }

  static toDateString(date) {
    return dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
  }

  static toLocalDateString(date) {
    return dateFormat(this.convertToLocalDate(date), 'yyyy-mm-dd HH:MM:ss');
  }

  static toDuration(seconds) {
    let sdat = new Date();
    let edat = new Date(sdat.getTime()+1000*seconds);
    let dur = new Duration(sdat, edat);
    return dur.toString(1);
  }
}

module.exports = DateUtilities;
