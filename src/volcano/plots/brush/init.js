export function init() {
    var brush = this;
    var plots = this.parent;
    var chart = this.parent.parent;

    chart.plots.svgs.each(function(d) {
        d3
            .select(this)
            .append('g')
            .attr('class', 'brush')
            .call(
                d3.svg
                    .brush()
                    .x(chart.x)
                    .y(chart.y)
                    .on('brushstart', brush.start)
                    .on('brush', brush.update)
                    .on('brushend', brush.end)
            );
    });
}
