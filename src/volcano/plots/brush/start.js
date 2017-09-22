export function start(chart) {
    var plots = chart.plots;
    var current = d3.select(this.parentNode.parentNode);
    var svgs = plots.wrap.selectAll('div.multiple').select('svg');

    chart.wrap.classed('brushed', true);
    svgs.classed('brushing', false);
    current.classed('brushing', true);

    //clear all brushed hexes
    d3.selectAll('g.hexGroup.overlay').remove();

    //clear any brush rectangles in other panels
    svgs
        .selectAll('g:not(.brushing) g.brush rect.extent')
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
}
