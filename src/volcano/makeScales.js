export function makeScales() {
    var chart = this;
    const settings = this.config;

    this.x = d3.scale
        .linear()
        .range([0, settings.width])
        .domain(
            d3.extent(this.data.clean, function(d) {
                return d[settings.ratio_col];
            })
        );

    this.y = d3.scale
        .log()
        .range([settings.height, 0])
        .domain([
            1,
            d3.min(this.data.clean, function(d) {
                return d[settings.p_col];
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

    this.colorScale = d3.scale
        .ordinal()
        .range(d3.scale.category10().range())
        .domain(
            d3
                .set(
                    this.data.clean.map(function(d) {
                        return d[settings.color_col];
                    })
                )
                .values()
        );

    this.radiusScale = d3.scale
        .sqrt()
        .range([settings.hexbin.radius.min, settings.hexbin.radius.max])
        .domain([settings.hexbin.countRange.min, settings.hexbin.countRange.max]);

    this.hexbin = d3
        .hexbin()
        .size([settings.width, settings.height])
        .radius(settings.hexbin.radius.max)
        .x(function(d) {
            return chart.x(d[settings.ratio_col]);
        })
        .y(function(d) {
            return chart.y(d[settings.p_col]);
        });
}
