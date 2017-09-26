export function end(multiple) {
    var volcano = multiple.parent.parent;
    var plots = multiple.parent;
    var settings = volcano.config;
    var current = multiple.svg;

    //	build a data set of the selected taxa
    var current_points = current.selectAll('circle.selected').data();
    var current_hexes = current.selectAll('path.selected').data();
    var current_hexes = d3.merge(current_hexes);
    var currentIDs = d3.merge([current_points, current_hexes]).map(function(d) {
        return d[settings.id_col.value_col];
    });

    //prep hex overlay data
    if (currentIDs.length) {
        //Nest brushed data.
        volcano.data.overlay = volcano.makeNestedData(currentIDs);

        //Draw brushed data.
        volcano.tables.drawSelected.multiplier = 1;
        //  volcano.data.table = makeTableData(volcano.data.brushed)
        volcano.tables.drawSelected(volcano.data.brushed);
        volcano.tables.drawDetails();

        //Clear brush?
        volcano.data.nested.forEach(function(d) {
            if (d.key != current.data()[0].key) {
                d.overlay = volcano.data.overlay.filter(function(e) {
                    return e.key == d.key;
                })[0].hexData;
            } else {
                d.overlay = [];
            }
        });
    } else {
        volcano.wrap.classed('brushed', false);
        volcano.data.nested.forEach(function(d) {
            d.overlay = [];
        });

        //Clear tables.
        volcano.tables.drawSelected.multiplier = 1;
        volcano.tables.drawDetails();

        volcano.wrap
            .selectAll('g.brush')
            .select('rect.extent')
            .attr('height', 0)
            .attr('width', 0);
    }

    //draw hex overlays
    plots.multiples.forEach(function(m) {
        m.drawHexes(true);
        m.highlight.init();
    });
}
