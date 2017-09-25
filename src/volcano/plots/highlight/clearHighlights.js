export function clearHighlights(d, volcano) {
    d3
        .select(this)
        .attr('stroke', null)
        .attr('stroke-width', null);

    volcano.tables.selected.table.selectAll('tr.selected').style('border', null);
}
