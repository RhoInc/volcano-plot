export function init() {
    var brush = this;
    var multiple = this.parent;
    var plots = this.parent.parent;
    var volcano = this.parent.parent.parent;
    var settings = volcano.config;

    brush.wrap = multiple.svg.append('g').attr('class', 'brush');
    brush.brush = d3.svg
        .brush()
        .x(volcano.x)
        .y(volcano.y)
        .on('brushstart', function(d) {
            brush.start.call(this, volcano);
        })
        .on('brush', function(d) {
            brush.update.call(this, volcano);
        })
        .on('brushend', function(d) {
            brush.end.call(this, volcano);
        });
    brush.wrap.call(brush.brush);
}
