import highlightCircles from '../../plots/drawHexes/highlightCircles';

export default function onClick(row, d) {
    this.selected.table.selectAll('tbody tr').classed('clicked', false);
    this.parent.wrap.selectAll('circle.clicked').remove();
    d3.select(row).classed('clicked', true);
    this.selected.clicked = d;
    this.drawDetails(d);

    //Highlight points
    this.parent.data.clicked = this.parent.data.clean.filter(
        di => di[this.parent.config.id_col.value_col] === d[this.parent.config.id_col.value_col]
    );
    this.parent.plots.svgs.each(
        di => (di.clicked = this.parent.data.clicked.filter(dii => dii.plotName === di.key))
    );
    highlightCircles.call(this.parent, 'click');
}
