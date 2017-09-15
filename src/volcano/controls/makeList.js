export function makeList() {
    var controls = this;
    var filters = this.filters;
    var chart = this.parent;
    var settings = this.parent.config;

    filters.list.options = d3.set(chart.data.clean.map(m => m[filters.list.var])).values();
    if (filters.list.ul) filters.list.ul.remove();
    filters.list.ul = filters.list.wrap.append('ul');
    filters.list.lis = filters.list.ul
        .selectAll('li')
        .data(filters.list.options)
        .enter()
        .append('li')
        .append('a')
        .text(d => d);

    filters.list.lis.on('click', function(d) {
        chart.data.filtered = chart.data.clean.filter(f => f[filters.list.var] == d);
        chart.plot.update();
    });
}
