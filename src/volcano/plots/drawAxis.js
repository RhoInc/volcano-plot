export function drawAxis() {
    var multiple = this;
    var plots = this.parent;
    var volcano = this.parent.parent;
    var settings = volcano.config;

    multiple.xAxis = multiple.svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + settings.height + ')')
        .call(volcano.xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('font-size', '24')
        .attr('x', 450)
        .attr('dy', '2em')
        .attr('fill', '#999')
        .style('text-anchor', 'middle')
        .text('Risk Ratio');

    if (multiple.index == 0 || settings.showYaxis !== 'first') {
        multiple.yAxisWrap = multiple.svg
            .append('g')
            .attr('class', 'y axis')
            .call(volcano.yAxis);

        multiple.yAxisWrap
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
}
