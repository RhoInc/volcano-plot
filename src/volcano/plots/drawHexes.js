export function drawHexes(overlay = false) {
    var chart = this.parent;
    var settings = this.parent.config;
    chart.plots.svgs.each(function(d) {
        //draw the main hexes/circles
        var pointGroups = d3
            .select(this)
            .selectAll('g.hexGroups')
            .data(overlay ? d.overlay : d.hexData)
            .enter()
            .append('g')
            .attr('class', 'hexGroup')
            .classed('overlay', overlay);

        pointGroups.each(function(d) {
            if (d.drawCircles) {
                d3
                    .select(this)
                    .selectAll('circle')
                    .data(d)
                    .enter()
                    .append('circle')
                    .attr('class', 'point')
                    .attr('cx', d => chart.x(d[settings.ratio_col]))
                    .attr('cy', d => chart.y(d[settings.p_col]))
                    .attr('r', 2)
                    .attr(
                        'fill',
                        d => (overlay ? 'white' : chart.colorScale(d[settings.color_col]))
                    );
            } else {
                d3
                    .select(this)
                    .append('path')
                    .attr('class', 'hex')
                    .attr('d', d => chart.hexbin.hexagon(chart.radiusScale(d.size)))
                    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
                    .attr('fill', d => (overlay ? 'white' : d.color));
            }
        });
    });
}
