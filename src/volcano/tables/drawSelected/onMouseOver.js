export default function onMouseOver(row, d) {
    d3.select(row).classed('highlighted', true);
    this.drawDetails(d);
}
