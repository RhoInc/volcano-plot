import { setDefaults } from './setDefaults.js';

export function init(data) {
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'ig-volcano');

    this.config = setDefaults(this.config);
    this.layout();

    this.data = {};
    this.data.raw = data;
    this.data.clean = this.makeCleanData();
    this.makeScales();
    this.data.nested = this.makeNestedData();

    this.plots.parent = this;
    this.plots.init();

    this.tables.parent = this;
    this.tables.init();
}
