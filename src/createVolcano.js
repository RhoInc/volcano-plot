import { init } from './volcano/init';
import { makeScales } from './volcano/makeScales';
import { makeCleanData } from './volcano/makeCleanData.js';
import { makeNestedData } from './volcano/makeNestedData.js';
import { layout } from './volcano/layout';
import { plots } from './volcano/plots';

export function createVolcano(element = 'body', config) {
    var volcano = {
        element: element,
        config: config,
        init: init,
        makeScales: makeScales,
        layout: layout,
        makeCleanData: makeCleanData,
        makeNestedData: makeNestedData,
        plots: plots
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
