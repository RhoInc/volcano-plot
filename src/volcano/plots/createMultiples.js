//create the small multiples
import { layout } from './layout';
import { drawAxis } from './drawAxis';
import { drawHexes } from './drawHexes';
import { update } from './update';
import { init as brushinit } from './brush/init';
import { start as brushstart } from './brush/start';
import { update as brushupdate } from './brush/update';
import { end as brushend } from './brush/end';

export function createMultiples() {
    var plots = this;
    var volcano = this.parent;

    plots.multiples = volcano.data.nested.map(function(d, i) {
        var multiple = {
            index: i,
            layout: layout,
            drawAxis: drawAxis,
            drawHexes: drawHexes,
            update: update,
            brush: {
                init: brushinit,
                start: brushstart,
                update: brushupdate,
                end: brushend
            }
        };

        multiple.parent = plots;
        multiple.volcano = volcano;
        multiple.label = d.key;
        multiple.data = d;

        return multiple;
    });
}
