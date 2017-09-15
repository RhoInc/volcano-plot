export default function onMouseLeave() {
    this.selected.table.selectAll('tbody tr').classed('highlighted', false);
    this.parent.wrap.selectAll('circle.highlighted:not(.clicked)').remove();
    this.drawDetails(this.selected.clicked);
}
