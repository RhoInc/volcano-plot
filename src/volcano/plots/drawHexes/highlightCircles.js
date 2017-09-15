export default function highlightCircles(trigger = 'mouseover') {
    const chart = this;

    this.wrap.selectAll('circle.highlighted:not(.clicked)').remove();

    this.plots.svgs.each(function(d) {
        const svg = d3.select(this);

        d.highlighted.forEach(di => {
            svg
                .append('circle')
                .classed('highlighted', true)
                .classed('clicked', trigger === 'click')
                .attr({
                    cx: chart.x(+di.fc),
                    cy: chart.y(+di.post),
                    r: 3,
                    fill: 'white',
                    stroke: trigger === 'mouseover' ? 'red' : 'black',
                    'stroke-width': '1.5px'
                });
        });
    });
}
