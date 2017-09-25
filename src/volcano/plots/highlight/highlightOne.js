export function highlightOne(d, volcano) {
    //highlight the mark
    d3
        .select(this)
        .attr('stroke', 'black')
        .attr('stroke-width', '2px');

    //highlight the tables
    var allRows = volcano.tables.selected.table.selectAll('tr.selected');
    var matchedRow = allRows.filter(
        row_data => row_data[volcano.config.id_col.value_col] == d[volcano.config.id_col.value_col]
    );
    matchedRow.style('border', '1px solid black');

    //draw the details
    volcano.tables.drawDetails(matchedRow.data()[0]);
}
