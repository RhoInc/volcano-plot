export function update() {
    //clear stuff
    var chart = this.parent;
    var settings = this.parent.config;
    chart.plots.wrap.selectAll('g.hexGroup').remove();
    chart.tables.drawSelected.multiplier = 1;
    chart.tables.drawSelected([]);
    chart.tables.drawDetails();
    chart.wrap.classed('brushed', false);
    chart.wrap
        .selectAll('g.brush')
        .select('rect.extent')
        .attr('height', 0)
        .attr('width', 0);

    //bind the new data
    chart.plots.svgs.data(chart.data.nested, function(d) {
        return d.key;
    });
    this.drawHexes();
}
