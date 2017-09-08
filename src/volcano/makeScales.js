export function makeScales() {
    const settings = this.config;
    console.log(this);
    this.x = d3.scale
        .linear()
        .range([0, settings.width])
        .domain(
            d3.extent(this.data.clean, function(d) {
                return d[settings.vars.ratio];
            })
        );

    this.y = d3.scale
        .log()
        .range([settings.height, 0])
        .domain([
            1,
            d3.min(this.data.clean, function(d) {
                return d[settings.vars.pval];
            })
        ]);

    this.xAxis = d3.svg
        .axis()
        .scale(this.x)
        .orient('bottom');
    this.yAxis = d3.svg
        .axis()
        .scale(this.y)
        .orient('left')
        .ticks(5, d3.format('r'));

    this.radiusScale = d3.scale
        .sqrt()
        .range([settings.hexbin.radius.min, settings.hexbin.radius.max])
        .domain([settings.hexbin.countRange.min, settings.hexbin.countRange.max]);

    this.hexbin = d3
        .hexbin()
        .size([settings.width, settings.height])
        .radius(settings.hexbin.radius.max);
}
