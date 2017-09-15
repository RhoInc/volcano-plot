export default function onMouseLeave() {
    this.selected.table.selectAll('tbody tr').classed('highlighted', false);
    this.drawDetails(this.selected.clicked);
}
