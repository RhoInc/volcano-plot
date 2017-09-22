//create the small multiples
import { layout } from './layout';
import { drawAxis } from './drawAxis';
import { drawHexes } from './drawHexes';
import { brush } from './brush';
import { update } from './update';

export function createMultiples() {
    var plots = this;
    var volcano = this.parent;

    plots.multiples = volcano.data.nested.map(function(d, i) {
        console.log(d);
        var multiple = {
            index: i,
            layout: layout,
            drawAxis: drawAxis,
            drawHexes: drawHexes,
            brush: brush,
            update: update
        };

        multiple.parent = plots;
        multiple.volcano = volcano;
        multiple.label = d.key;

        multiple.data = d;

        return multiple;
    });
}
