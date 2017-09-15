export default function onMouseLeave() {
    this.tables.selected.table.selectAll('tbody tr').classed('highlighted', false);
    this.wrap.selectAll('circle.highlighted:not(.clicked)').remove();
    this.tables.drawDetails(this.tables.selected.clicked);
}
