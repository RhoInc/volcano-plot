export function makeNestedData(ids) {
    //convenience mappings
    var chart = this;
    var data = this.data.filtered;
    var settings = this.config;
    if (ids) {
        var idset = new Set(ids);
        data = data.filter(d => idset.has(d[settings.id_col.value_col]));
    }

    //Attach brushed data to data object.
    chart.data.brushed = data;

    var nested = d3
        .nest()
        .key(function(d) {
            return d.plotName;
        })
        .entries(data);
    nested.forEach(function(d) {
        d.hexData = chart.hexbin(d.values);
        //Flag the groups to draw the individual points
        d.hexData.forEach(function(e) {
            e.drawCircles = e.length <= settings.hexbin.countRange.min; //draw circles (t) or hex (f)

            //Set the radius of each hex
            e.size =
                e.length > settings.hexbin.countRange.max
                    ? settings.hexbin.countRange.max
                    : e.length; //calculate the radius variable

            //count records for each level
            e.levels = d3
                .nest()
                .key(function(d) {
                    return d[settings.color_col];
                })
                .rollup(function(d) {
                    return d.length;
                })
                .entries(e);

            e.levels.sort(function(a, b) {
                return b.values - a.values;
            });
            e.color =
                chart.colorScale.domain().indexOf(e.levels[0].key) > -1
                    ? chart.colorScale(e.levels[0].key)
                    : '#999';
        });
    });
    return nested;
}
