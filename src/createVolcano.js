export function createVolcano(element = 'body', config) {
    var volcano = {
        element: element,
        config: config
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
