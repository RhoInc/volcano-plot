import onClick from './onClick';

export default function highlightCircles(trigger = 'mouseover') {
    const chart = this;

    this.wrap.selectAll('circle.highlighted:not(.clicked)').remove();

    this.plots.svgs.each(function(d) {
        const svg = d3.select(this);
        let circles

        if (trigger === 'click') {
            d.clicked.forEach(di => {
                circles = svg
                    .append('circle')
                    .datum(di)
                    .classed('clicked', true)
                    .attr({
                        cx: chart.x(+di.fc),
                        cy: chart.y(+di.post),
                        r: 10,
                        fill: 'white',
                        stroke: 'black',
                        'stroke-width': '2px'
                    });
                circles
                    .transition()
                    .duration(250)
                    .attr('r', 4);
            });
        } else {
            d.highlighted.forEach(di => {
                circles = svg
                    .append('circle')
                    .datum(di)
                    .classed('highlighted', true)
                    .attr({
                        cx: chart.x(+di.fc),
                        cy: chart.y(+di.post),
                        r: 9,
                        fill: 'white',
                        stroke: 'red',
                        'stroke-width': '1px'
                    });
                circles
                    .transition()
                    .duration(40)
                    .attr('r', 3);
                circles
                    .on('click', function() {
                        onClick.call(chart, this, di);
                    });
            });
        }
    });
}
