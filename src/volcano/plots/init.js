export function init() {
    var volcano = this.parent;
    var plots = this;

    //create the multiples objects
    this.createMultiples();

    //initialize the charts
    this.multiples.forEach(function(m) {
        m.layout();
        m.brush.parent = m;
        m.brush.init();

        m.drawAxis();
        m.drawHexes();
        m.highlight.init();
    });
}
