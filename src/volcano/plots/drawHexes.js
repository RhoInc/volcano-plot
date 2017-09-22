export function drawHexes(overlay = false) {
    var multiple = this;
    var plots = this.parent;
    var volcano = this.parent.parent;
    var settings = volcano.config;

    //draw the main hexes/circles
    multiple.pointGroups = multiple.svg
        .selectAll('g.hexGroups')
        .data(d => (overlay ? d.overlay : d.hexData))
        .enter()
        .append('g')
        .attr('class', 'hexGroup')
        .classed('overlay', overlay);

    multiple.pointGroups.each(function(d) {
        if (d.drawCircles) {
            d3
                .select(this)
                .selectAll('circle')
                .data(d)
                .enter()
                .append('circle')
                .attr('class', 'point')
                .attr('cx', d => volcano.x(d[settings.ratio_col]))
                .attr('cy', d => volcano.y(d[settings.p_col]))
                .attr('r', 2)
                .attr(
                    'fill',
                    d =>
                        overlay
                            ? 'white'
                            : volcano.colorScale.domain().indexOf(d[settings.color_col]) > -1
                              ? volcano.colorScale(d[settings.color_col])
                              : '#999'
                );
        } else {
            d3
                .select(this)
                .append('path')
                .attr('class', 'hex')
                .attr('d', d => volcano.hexbin.hexagon(volcano.radiusScale(d.size)))
                .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
                .attr('fill', d => (overlay ? 'white' : d.color));
        }
    });
}
