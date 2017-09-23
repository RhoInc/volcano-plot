export function start(multiple) {
    var volcano = multiple.parent.parent;
    var plots = multiple.parent;
    var current = d3.select(this.parentNode.parentNode);
    var svgs = plots.wrap.selectAll('div.multiple').select('svg');

    volcano.wrap.classed('brushed', true);
    svgs.classed('brushing', false);
    current.classed('brushing', true);

    //clear all brushed hexes
    d3.selectAll('g.hexGroup.overlay').remove();

    //clear any brush rectangles in other panels

    svgs
        .selectAll('g:not(.brushing) rect.extent')
        .attr('height', 0)
        .attr('width', 0);

    //de-select all hexgroups
    var points = svgs
        .selectAll('circle.point')
        .attr('fill-opacity', 1)
        .classed('selected', false);

    var hexes = svgs
        .selectAll('path.hex')
        .attr('fill-opacity', 1)
        .classed('selected', false);

    /*
    console.log(multiple.brush.brush.extent());
    var m = d3.mouse(multiple.svg.node());
    console.log(m);
    var p = [volcano.x.invert(m[0]), volcano.y.invert(m[1])];
    console.log(p);
    multiple.brush.brush.extent([p, p]);
    console.log(multiple.brush.brush.extent());
    */
}
