export function init() {
    var multiple = this.parent;
    var volcano = this.parent.parent.parent;
    var marks = multiple.svg.selectAll('g.hexGroup');
    var brush = multiple.brush;

    marks
        .on('mouseover', function() {
            console.log('in');
            d3
                .select(this)
                .selectAll('*')
                .attr('stroke', 'black')
                .attr('stroke-width', '2px');
        })
        .on('mouseout', function() {
            d3
                .select(this)
                .selectAll('*')
                .attr('stroke', null)
                .attr('stroke-width', null);
        })
        .on('mousedown', function(d) {
            var m = d3.mouse(multiple.svg.node());
            var p = [volcano.x.invert(m[0]), volcano.y.invert(m[1])];
            brush.brush.extent([p, p]);
            //brush.start.call(this, multiple);
            //brush.update.call(this, volcano);
        });
}
