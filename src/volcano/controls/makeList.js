export function makeList() {
    var controls = this;
    var filters = this.filters;
    var chart = this.parent;
    var settings = this.parent.config;

    //  filters.list.options = d3.set(chart.data.clean.map(m => m[filters.list.var])).values();
    if (filters.list.ul) filters.list.ul.remove();
    filters.list.ul = filters.list.wrap.append('ul');
    filters.list.lis = filters.list.ul
        .selectAll('li')
        .data(chart.data.levels)
        .enter()
        .append('li')
        .classed('active', d => d.selected);

    filters.list.inputs = filters.list.lis
        .append('input')
        .attr('type', 'checkbox')
        .property('checked', true);
    filters.list.links = filters.list.lis
        .append('a')
        .text(d => d.key + ' (' + d.values + ')')
        .style(
            'color',
            d => (chart.colorScale.domain().indexOf(d.key) > -1 ? chart.colorScale(d.key) : '#999')
        );

    //selected a single level
    filters.list.links.on('click', function(d) {
        var toggle = d3.select(this).property('checked');
        var li = d3.select(this.parentNode);

        //deselect all
        filters.list.lis.each(function(d) {
            d.selected = false;
        });
        filters.list.lis.classed('active', false);
        filters.list.inputs.property('checked', false);

        //select this one
        d.selected = true;
        li.classed('active', true);
        li.select('input').property('checked', true);

        chart.data.filtered = chart.makeFilteredData();
        chart.data.nested = chart.makeNestedData();
        chart.plots.update();
    });

    //toggle a single level

    filters.list.inputs.on('click', function(d) {
        var li = d3.select(this.parentNode);
        var toggle = li.select('input').property('checked');

        li.select('input').property('checked');
        li.classed('active', toggle);
        d.selected = toggle;

        chart.data.filtered = chart.makeFilteredData();
        chart.data.nested = chart.makeNestedData();
        chart.plots.update();
    });
}
