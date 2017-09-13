import onClick from './drawSelected/onClick';

export default function drawSelected(data) {
    this.selected.data = data;
    this.selected.wrap.select('#nSelected').text(data.length);
    this.selected.wrap.select('#none-selected').style('display', data.length ? 'none' : 'table-row');
    const
        tables = this,
        rows = this.selected.table.select('tbody')
            .selectAll('tr.selected')
                .data(data)
                .enter()
            .append('tr')
            .classed('selected', true)
            .on('click', function(d) {
                rows.classed('active', false);
                onClick.call(this, d, tables);
            });

  //Append data rows.
    rows.each(function(d) {
        const
            row = d3.select(this);

        row.selectAll('td')
                .data(tables.selected.variables.map(variable => d[variable.value_col]))
                .enter()
            .append('td')
            .text(d => d);
    });
}
