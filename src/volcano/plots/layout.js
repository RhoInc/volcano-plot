export function layout() {
    var chart = this.parent;
    var settings = this.parent.config;

    chart.plots.svgs = chart.wrap
        .select('div.middle')
        .selectAll('div.volcanoPlot')
        .data(chart.data.nested, function(d) {
            return d.key;
        })
        .enter()
        .append('div')
        .attr('class', 'volcanoPlot')
        .append('svg')
        .attr('height', settings.height + settings.margin.top + settings.margin.bottom)
        .attr('width', function(d, i) {
            //change left margin
            return (i > 0) & (settings.showYaxis == 'first')
                ? settings.width + (settings.margin.left - 60) + settings.margin.right
                : settings.width + settings.margin.left + settings.margin.right;
        })
        .append('g')
        .attr('transform', function(d, i) {
            return (i > 0) & (settings.showYaxis == 'first')
                ? 'translate(' + (settings.margin.left - 60) + ',' + settings.margin.top + ')'
                : 'translate(' + settings.margin.left + ',' + settings.margin.top + ')';
        });
}
