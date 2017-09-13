export default function drawDetails(datum) {
    this.details.data.info = datum;
    this.details.data.stats = this.parent.data.clean.filter(d => d.gg_id === datum.gg_id);
    this.details.table.selectAll('tbody tr').remove();
    const infoHeader = this.details.table
            .select('tbody')
            .append('tr')
            .classed('header', true)
            .attr('id', 'info-header')
            .append('td')
            .attr('colspan', 2)
            .text('Taxa Information'),
        infoRows = this.details.table
            .select('tbody')
            .selectAll('tr.info')
            .data(this.details.variables)
            .enter()
            .append('tr')
            .classed('info', true),
        statsHeader = this.details.table
            .select('tbody')
            .append('tr')
            .classed('header', true)
            .attr('id', 'info-header')
            .append('td')
            .attr('colspan', 2)
            .text('Risk Ratios'),
        statsRows = this.details.table
            .select('tbody')
            .selectAll('tr.stats')
            .data(this.details.data.stats)
            .enter()
            .append('tr')
            .classed('stats', true);

    //Append info rows.
    infoRows.each(function(d) {
        const row = d3.select(this);

        row.append('td').text(d => d.label || d.value_col || d);
        row.append('td').text(d => datum[d.value_col || d]);
    });

    //Append stats rows.
    statsRows.each(function(d) {
        const row = d3.select(this);

        row.append('td').text(d => d.plotName);
        row.append('td').text(d => `${d3.format('.2f')(+d.fc)} (p=${d3.format('.5f')(+d.p)})`);
    });
}
