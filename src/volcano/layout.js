export function layout() {
    this.plots.wrap = this.wrap.append('div').attr('class', 'controls');
    this.controls.wrap = this.wrap.append('div').attr('class', 'charts');
    this.tables.wrap = this.wrap.append('div').attr('class', 'tables');
}
