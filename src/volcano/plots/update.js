export function update() {
    //clear stuff
    var multiple = this;
    var plots = this.parent;
    var volcano = this.parent.parent;
    var settings = volcano.config;

    multiple.wrap.selectAll('g.hexGroup').remove();

    multiple.brush.wrap
        .select('rect.extent')
        .attr('height', 0)
        .attr('width', 0);

    multiple.wrap.datum(multiple.data);
    multiple.svg.datum(multiple.data);
    multiple.drawHexes();
    /*/bind the new data
    volcano.plots.multiples.forEach(function(m) {
        var current = chart.data.nested.filter(f => f.key == m.key);
        m.wrap.data(current);
        this.drawHexes();
    });
    */
}
