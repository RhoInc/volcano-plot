import highlightCircles from './highlightCircles';

export default function onMouseMove(svg, d) {
    const mouse = d3.mouse(svg),
        coordinates = d.coordinates.concat(d.overlayCoordinates),
        nearby = coordinates.filter(d => {
            //if ((d.x - 5) <= mouse[0] && mouse[0] <= (d.x + 5) &&
            //    (d.y - 5) <= mouse[1] && mouse[1] <= (d.y + 5)) {

            //    console.log(d);
            //    console.log(
            //        (d.x - 5), mouse[0], (d.x + 5)
            //    );
            //    console.log(
            //        (d.y - 5), mouse[1], (d.y + 5)
            //    );
            //}
            d.distance = Math.sqrt(Math.pow(d.x - mouse[0], 2) + Math.pow(d.y - mouse[1], 2));
            return (
                d.x - 10 <= mouse[0] &&
                mouse[0] <= d.x + 10 &&
                d.y - 10 <= mouse[1] &&
                mouse[1] <= d.y + 10
            );
        });

    if (nearby.length) {
        const closest = d3.min(nearby, d => d.distance),
            datum = nearby.filter(d => d.distance === closest)[0];
        this.data.highlighted = this.data.clean.filter(d => datum.id === d[this.config.id_col]);
        this.plots.svgs.each(
            d => (d.highlighted = this.data.highlighted.filter(di => di.plotName === d.key))
        );
        this.tables.drawDetails(this.data.highlighted.pop());
        highlightCircles.call(this);
    }
}
