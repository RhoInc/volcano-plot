export function layout() {
    var multiple = this;
    var plots = this.parent;
    var volcano = this.parent.parent;
    var settings = volcano.config;

    multiple.wrap = plots.wrap
        .append('div')
        .attr('class', 'multiple')
        .datum(multiple.data);

    multiple.svg = multiple.wrap
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
