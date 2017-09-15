export function layout() {
    this.controls.wrap = this.wrap.append('div').attr('class', 'controls');
    this.plots.wrap = this.wrap.append('div').attr('class', 'charts');
    this.tables.wrap = this.wrap.append('div').attr('class', 'tables');
}
