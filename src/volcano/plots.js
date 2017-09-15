import { init } from './plots/init';
import { layout } from './plots/layout';
import { drawAxis } from './plots/drawAxis';
import { drawHexes } from './plots/drawHexes';
import { brush } from './plots/brush';
import { update } from './plots/update';

export var plots = {
    init: init,
    layout: layout,
    drawAxis: drawAxis,
    drawHexes: drawHexes,
    brush: brush,
    update: update
};
