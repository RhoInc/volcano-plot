import highlightCircles from './highlightCircles';

export default function onMouseMove(svg,coordinates) {
    const
        mouse = d3.mouse(svg),
        nearby = coordinates
            .filter(d => {
                return (
                    (mouse[0] - 5) <= d.x && d.x <= (mouse[0] + 5) &&
                    (mouse[1] - 5) <= d.y && d.y <= (mouse[1] + 5)
                );
            });
    if (nearby.length) {
        this.data.highlighted = this.data.clean
            .filter(d => d3.merge(nearby.map(d => d.ids)).indexOf(d[this.config.id_col]) > -1);
        highlightCircles.call(this);
    }
}
