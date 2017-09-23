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
    //multiple.svg.select('rect.background').moveToBack();
}
