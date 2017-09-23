export function init() {
    var brush = this;
    var multiple = this.parent;
    var plots = this.parent.parent;
    var volcano = this.parent.parent.parent;
    var settings = volcano.config;

    /* --- Standard Brush Initialization --- */
    //brush.wrap = multiple.svg.append('g').attr('class', 'brush');
    brush.brush = d3.svg
        .brush()
        .x(volcano.x)
        .y(volcano.y)
        .on('brushstart', function(d) {
            brush.start.call(this, multiple);
        })
        .on('brush', function(d) {
            brush.update.call(this, multiple);
        })
        .on('brushend', function(d) {
            brush.end.call(this, multiple);
        });
    multiple.svg.call(brush.brush);
    //multiple.svg.select('rect.extent').moveToBack();
    multiple.svg.select('rect.background').moveToBack();

    /* --- Simulate brush.start on mousedown within a circle or hex --- */
    var marks = multiple.svg.selectAll('g.hexGroup');

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
