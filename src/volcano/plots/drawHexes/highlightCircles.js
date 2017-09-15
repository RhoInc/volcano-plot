export default function highlightCircles() {
    const chart = this;

    this.wrap.selectAll('circle.highlighted').remove();

    this.plots.svgs.each(function(d) {
        const svg = d3.select(this);

        d.highlighted.forEach(di => {
            svg
                .append('circle')
                .classed('highlighted', true)
                .attr({
                    cx: chart.x(+di.fc),
                    cy: chart.y(+di.post),
                    r: 3,
                    fill: 'white',
                    stroke: 'red',
                    'stroke-width': '1.5px'
                });
        });
    });
}
