import onClick from './drawSelected/onClick';
export default function drawSelected(data) {
    this.selected.data = data;
    this.selected.wrap.selectAll('.nSelected').text(data.length);
    this.selected.table.selectAll('tbody tr:not(#none-selected):not(#gimme-moar)').remove();
    this.selected.table.select('#none-selected').classed('hidden', data.length);
    this.selected.multiplier = data.length < 25 ? 1 : this.selected.multiplier;
    this.selected.table
        .select('#gimme-moar')
        .classed('hidden', data.length < 25 * this.selected.multiplier);
    const tables = this,
        rows = this.selected.table
            .select('tbody')
            .selectAll('tr.selected')
            .data(data.filter((d, i) => i < 25 * this.selected.multiplier))
            .enter()
            .append('tr')
            .classed('selected', true)
            .on('click', function(d) {
                rows.classed('active', false);
                onClick.call(this, d, tables);
            });

    //Append data rows.
    rows.each(function(d) {
        const row = d3.select(this);

        row
            .selectAll('td')
            .data(tables.selected.variables.map(variable => d[variable.value_col]))
            .enter()
            .append('td')
            .text(d => d);
    });

    this.selected.table
        .select('tbody')
        .node()
        .appendChild(this.selected.table.select('#gimme-moar').node());
}
