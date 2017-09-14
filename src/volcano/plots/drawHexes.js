import onMouseMove from './drawHexes/onMouseMove';

export function drawHexes(overlay = false) {
    var chart = this.parent;
    var settings = this.parent.config;
    chart.plots.svgs.each(function(d) {
        d.coordinates = [];

        //draw the main hexes/circles
        var pointGroups = d3
            .select(this)
            .selectAll('g.hexGroups')
            .data(overlay ? d.overlay : d.hexData)
            .enter()
            .append('g')
            .attr('class', 'hexGroup')
            .classed('overlay', overlay);

        pointGroups.each(function(di) {
            let mark;
            if (di.drawCircles) {
                mark = d3.select(this)
                    .selectAll('circle')
                    .data(di)
                    .enter()
                    .append('circle')
                    .attr('class', 'point')
                    .attr('cx', dii => chart.x(dii[settings.ratio_col]))
                    .attr('cy', dii => chart.y(dii[settings.p_col]))
                    .attr('r', 2)
                    .attr('fill',
                        dii => overlay
                            ? 'white'
                            : chart.colorScale(dii[settings.color_col]));
            } else {
                mark = d3.select(this)
                    .append('path')
                    .attr('class', 'hex')
                    .attr('d', dii => chart.hexbin.hexagon(chart.radiusScale(dii.size)))
                    .attr('transform', dii => 'translate(' + dii.x + ',' + dii.y + ')')
                    .attr('fill', dii => (overlay ? 'white' : dii.color));
            }

            d.coordinates.push({
                type: di.drawCircles
                    ? 'circle'
                    : 'hex',
                ids: di.map(dii => dii[settings.id_col]),
                x: di.x,
                y: di.y
            });
        });
    })
    .on('mousemove', function(d) {
        onMouseMove.call(chart, this, d.coordinates);
    });
}
