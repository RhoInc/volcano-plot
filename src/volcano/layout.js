export function layout() {
    this.controls.wrap = this.wrap.append('div').attr('class', 'controls');
    var main = this.wrap.append('div').attr('class', 'main');
    this.plots.wrap = main.append('div').attr('class', 'charts');
    this.tables.wrap = main.append('div').attr('class', 'tables');
}
