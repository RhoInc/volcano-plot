export function start(chart) {
    var brush = chart.plots.brush;
    var plots = chart.plots;
    var current = d3.select(this.parentNode.parentNode);

    chart.wrap.classed('brushed', true);
    plots.svgs.classed('brushing', false);
    current.classed('brushing', true);

    //clear all brushed hexes
    d3.selectAll('g.hexGroup.overlay').remove();

    //clear any brush rectangles in other panels
    chart.plots.svgs
        .selectAll('g:not(.brushing) g.brush rect.extent')
        .attr('height', 0)
        .attr('width', 0);

    //de-select all hexgroups
    var points = chart.plots.svgs
        .selectAll('circle.point')
        .attr('fill-opacity', 1)
        .classed('selected', false);

    var hexes = chart.plots.svgs
        .selectAll('path.hex')
        .attr('fill-opacity', 1)
        .classed('selected', false);

    var highlights = chart.plots.svgs.selectAll('circle.highlighted').remove();
}
