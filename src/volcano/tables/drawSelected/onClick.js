export default function onClick(d, tables) {
    d3.select(this).classed('active', true);
    tables.drawDetails(d);
}
