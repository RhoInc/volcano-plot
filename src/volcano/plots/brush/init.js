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
                    .on(
                        'brushstart',
                        function(d) {
                            brush.start.call(this, chart);
                        }
                    )
                    .on('brush', function(d) {
                        brush.update.call(this, chart);
                    })
                    .on('brushend', function(d) {
                        brush.end.call(this, chart);
                    })
            );
    });
    brush.wraps = chart.plots.svgs.select('g.brush').moveToBack();
    chart.plots.svgs
        .on(
            'mousedown',
            function() {
                console.log('Mouse is down');
                brush.wraps.moveToFront();
                //brush.start.call(thisBrush, chart);
            },
            true
             //capture event
        )
        .on('mouseup', function() {
            brush.wraps.moveToBack();
            console.log('mouse is up');
        });
}
