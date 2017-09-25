import { highlightOne } from './highlightOne.js';
import { clearHighlights } from './clearHighlights.js';

export function init() {
    var multiple = this.parent;
    var volcano = this.parent.parent.parent;
    var markGroups = multiple.svg.selectAll('g.hexGroup');
    var marks = markGroups.selectAll('circle');
    var brush = multiple.brush;

    markGroups.on('mousedown', function(d) {
        var m = d3.mouse(multiple.svg.node());
        var p = [volcano.x.invert(m[0]), volcano.y.invert(m[1])];
        brush.brush.extent([p, p]);
        //brush.start.call(this, multiple);
        //brush.update.call(this, volcano);
    });

    marks
        .on('mouseover', function(d) {
            highlightOne.call(this, d, volcano);
        })
        .on('mouseout', function(d) {
            clearHighlights.call(this, d, volcano);
        });
}
