export function init() {
    this.layout();
    this.drawAxis();
    this.drawHexes();
    this.brush.parent = this;
    this.brush.init();
}
