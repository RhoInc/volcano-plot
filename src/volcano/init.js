import { setDefaults } from './setDefaults.js';

export function init(data) {
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'ig-volcano');
    this.data = {};
    this.data.raw = data;

    this.config = setDefaults(this.config);
    this.checkCols();

    this.layout();

    this.data.clean = this.makeCleanData();
    this.data.levels = this.makeLevelData();
    this.makeScales();
    this.data.nested = this.makeNestedData();

    this.controls.parent = this;
    this.controls.init();

    this.plots.parent = this;
    this.plots.init();

    this.tables.parent = this;
    this.tables.init();
}
