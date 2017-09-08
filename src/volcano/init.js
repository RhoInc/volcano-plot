import { setDefaults } from './setDefaults.js';
import { prepData } from './prepData.js';

export function init(data) {
    this.wrap = d3
        .select(settings.div)
        .append('div')
        .attr('class', 'ig-volcano');
    this.config = setDefaults(this.config);
    this.layout();

    this.data = {};
    this.data.raw = data;
    this.data.clean = prepData(data);

    this.makeScales();

    console.log(this);
}
