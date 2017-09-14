export function end(chart) {
    var brush = chart.plots.brush;
    var settings = chart.config;
    var plots = chart.plots;
    var current = d3.select(this.parentNode.parentNode);

    //	build a data set of the selected taxa
    var current_points = current.selectAll('circle.selected').data();
    var current_hexes = current.selectAll('path.selected').data();
    var current_hexes = d3.merge(current_hexes);
    var currentIDs = d3.merge([current_points, current_hexes]).map(function(d) {
        return d[settings.id_col];
    });

    //prep hex overlay data
    if (currentIDs.length) {
        chart.data.overlay = chart.makeNestedData(currentIDs);
        chart.data.nested.forEach(function(d) {
            if (d.key != current.data()[0].key) {
                d.overlay = chart.data.overlay.filter(function(e) {
                    return e.key == d.key;
                })[0].hexData;
            } else {
                d.overlay = [];
            }
        });
    } else {
        chart.data.nested.forEach(function(d) {
            d.overlay = [];
            chart.wrap.classed('brushed', false);
        });
    }

    //draw hex overlays
    plots.svgs.each(function(d) {
        chart.plots.drawHexes(true);
    });
}
