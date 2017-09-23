export function update(multiple) {
    var volcano = multiple.parent.parent;
    var plots = multiple.parent;
    var settings = volcano.config;
    var current = multiple.svg;
    var points = current.selectAll('circle.point');
    var hexes = current.selectAll('path.hex');
    var e = multiple.brush.brush.extent();
    console.log('updating');

    //Flag selected points and hexes
    //note - the hex data is stored in pixels, but the point data and brush data is in raw units, so we have to handle transforms accordingly.
    points.classed('selected', function(d) {
        return (
            e[0][0] <= +d[settings.ratio_col] &&
            +d[settings.ratio_col] <= e[1][0] &&
            e[0][1] <= +d[settings.p_col] &&
            +d[settings.p_col] <= e[1][1]
        );
    });

    hexes.classed('selected', function(d) {
        var x_raw = volcano.x.invert(d.x);
        var y_raw = volcano.y.invert(d.y);

        return e[0][0] <= x_raw && x_raw <= e[1][0] && e[0][1] <= y_raw && y_raw <= e[1][1]; // note - the order is flipped here because of the inverted pixel scale
    });

    //disable mouseover on unselected points
    //d3.selectAll("#"+outcome+" svg g g.allpoints g.points.unselected").classed("active",false)
    //d3.selectAll("#"+outcome+" svg g g.allpoints g.points.selected").classed("active",true)
}
