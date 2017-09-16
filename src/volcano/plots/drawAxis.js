export function drawAxis() {
    var chart = this.parent;
    var settings = this.parent.config;
    chart.plots.svgs
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + settings.height + ')')
        .call(chart.xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('font-size', '24')
        .attr('x', 450)
        .attr('dy', '2em')
        .attr('fill', '#999')
        .style('text-anchor', 'middle')
        .text('Risk Ratio');

    chart.plots.svgs.each(function(d, i) {
        if (i == 0 || settings.showYaxis !== 'first') {
            var yAxisWrap = d3
                .select(this)
                .append('g')
                .attr('class', 'y axis')
                .call(chart.yAxis);

            yAxisWrap
                .append('text')
                .attr('class', 'label')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '-65px')
                .attr('font-size', '24')
                .attr('fill', '#999')
                .style('text-anchor', 'end')
                .text('p-value');
            /*
            yAxisWrap
                .append('text')
                .attr('class', 'label')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '-53px')
                .attr('font-size', '10')
                .attr('fill', '#999')
                .style('text-anchor', 'end')
                .text('(Click to change quadrants)');
        */
        }
    });
}
