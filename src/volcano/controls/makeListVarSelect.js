export function makeListVarSelect() {
    var controls = this;
    var filters = this.filters;
    var chart = this.parent;
    var settings = this.parent.config;

    //Select the variable for filters
    filters.list.wrap.append('span').text('Filter Variable: ');
    filters.list.varSelect = filters.list.wrap.append('select');
    filters.list.varSelectOptions = filters.list.varSelect
        .selectAll('option')
        .data(settings.structure_cols)
        .enter()
        .append('option')
        .text(d => d.value_col);

    filters.list.varSelect.on('change', function(d) {
        settings.color_col = this.value;
        chart.data.levels = chart.makeLevelData();
        chart.colorScale.domain(chart.data.levels.map(m => m.key).slice(0, 10));
        controls.makeList();

        //update charts
        chart.data.filtered = chart.data.clean;
        chart.data.nested = chart.makeNestedData();
        chart.plots.update();
    });
}
