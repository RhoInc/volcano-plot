import { init } from './volcano/init';
import { makeScales } from './volcano/makeScales';
import { makeCleanData } from './volcano/makeCleanData.js';
import { makeNestedData } from './volcano/makeNestedData.js';
import { checkCols } from './volcano/checkCols.js';
import { layout } from './volcano/layout';
import { plots } from './volcano/plots';
import { tables } from './volcano/tables';

export function createVolcano(element = 'body', config) {
    var volcano = {
        element: element,
        config: config,
        init: init,
        makeScales: makeScales,
        layout: layout,
        makeCleanData: makeCleanData,
        makeNestedData: makeNestedData,
        checkCols: checkCols,
        plots: plots,
        tables: tables
    };

    volcano.events = {
        init() {},
        complete() {}
    };

    volcano.on = function(event, callback) {
        let possible_events = ['init', 'complete'];
        if (possible_events.indexOf(event) < 0) {
            return;
        }
        if (callback) {
            volcano.events[event] = callback;
        }
    };

    return volcano;
}
