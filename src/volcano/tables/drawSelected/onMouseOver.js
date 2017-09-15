import highlightCircles from '../../plots/drawHexes/highlightCircles';

export default function onMouseOver(row, d) {
    d3.select(row).classed('highlighted', true);
    this.drawDetails(d);

  //Highlight points
    this.parent.data.highlighted = this.parent.data.clean.filter(
        di => di[this.parent.config.id_col.value_col] === d[this.parent.config.id_col.value_col]
    );
    this.parent.plots.svgs.each(
        di => (di.highlighted = this.parent.data.highlighted.filter(dii => dii.plotName === di.key))
    );
    this.drawDetails(this.parent.data.highlighted.pop());
    highlightCircles.call(this.parent);
}
