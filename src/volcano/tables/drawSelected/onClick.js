export default function onClick(row, d) {
    d3.select(row).classed('clicked', true);
    this.selected.clicked = d;
    this.drawDetails(d);
}
