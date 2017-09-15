import highlightCircles from './highlightCircles';

export default function onClick(point, d) {
    this.wrap.selectAll('circle.clicked').remove();
    this.tables.selected.clicked = d;
    this.tables.drawDetails(d);

    //Highlight points
    this.data.clicked = this.data.clean.filter(
        di => di[this.config.id_col.value_col] === d[this.config.id_col.value_col]
    );
    this.plots.svgs.each(
        di => (di.clicked = this.data.clicked.filter(dii => dii.plotName === di.key))
    );
    highlightCircles.call(this, 'click');
}
