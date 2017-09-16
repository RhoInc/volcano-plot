export function makeFilterToggle() {
    var controls = this;
    var chart = this.parent;
    var settings = this.parent.config;

    this.filters.toggle.wrap.append('span').text('Filter Type: ');
    this.filters.toggle.options = this.filters.toggle.wrap
        .selectAll('li')
        .data(settings.filterTypes)
        .enter()
        .append('li')
        .append('a')
        .text(d => d)
        .classed('active', function(d, i) {
            return i == 0;
        });
    this.filters.toggle.options.on('click', function(d) {
        var activeFlag = d3.select(this).classed('active');
        if (!activeFlag) {
            controls.filters.current = d;
            controls.filters.toggle.options.classed('active', false);
            d3.select(this).classed('active', true);
            if (d == 'List') {
                controls.filters.tree.wrap.classed('hidden', true);
                controls.filters.list.wrap.classed('hidden', false);
            } else if (d == 'Tree') {
                controls.filters.tree.wrap.classed('hidden', false);
                controls.filters.list.wrap.classed('hidden', true);
            }
        }
    });
}
