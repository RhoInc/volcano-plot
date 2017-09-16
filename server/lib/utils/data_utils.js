'use strict';

const log = require('winston').loggers.get('app');
const fs = require('fs');
const path = require('path');

class DataUtils {

  /**
  * return first N lines of a file, null if not found
  */
  static headFile(path, lines=3) {
	  return new Promise((resolve, reject) => {

      if (!DataUtils.readable(path)) {
        resolve(null);
      }

	    let lineCount = 0;
	    let stubOut = [];
	    let lr = new (require('line-by-line'))(path);
	
	    lr
	    .on('line', (line) => {
	      stubOut[lineCount] = line;
	      lineCount++;
	      if (lineCount >= lines)
	        lr.end();
	    })
	    .on('end', () => {
	      lr.close();
	      resolve(stubOut);
	    })
	    .on('error', (err) => {
	      reject(err);
	    });
	
	  });
  }

  /**
   * whether can find and read the file specified
   */
  static readable(path) {
    if (!fs.existsSync(path))
      return false;

    let stat = fs.statSync(path);
    if (!stat || !stat.size)
      return false;

    return true;
  }
}

module.exports = DataUtils;
