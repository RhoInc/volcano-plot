export default function drawDetails(datum) {
    const settings = this.parent.config;
    this.details.table.selectAll('tbody tr').remove();

    //Draw table if datum is supplied.
    if (datum) {
        this.details.data.info = datum;
        this.details.data.stats = this.parent.data.clean.filter(function(d) {
            return d[settings.id_col.value_col] == datum[settings.id_col.value_col];
        });
        const infoHeader = this.details.table
                .select('tbody')
                .append('tr')
                .classed('header', true)
                .attr('id', 'info-header')
                .append('td')
                .attr('colspan', 2)
                .text('Comparison Information'),
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

            row.append('td').text(d => d.label);
            row.append('td').text(d => datum[d.value_col]);
        });

        //Append stats rows.
        statsRows.each(function(d) {
            const row = d3.select(this);
            row.append('td').text(d => d.plotName);
            row
                .append('td')
                .text(
                    d =>
                        d3.format('.2f')(d[settings.ratio_col]) +
                        ' (p=' +
                        d3.format('.5f')(d[settings.p_col]) +
                        ')'
                );
        });
    } else {
        delete this.details.data.info;
        delete this.details.data.stats;
    }
}
