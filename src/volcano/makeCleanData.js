export function makeCleanData() {
    var data = this.data.raw;
    var settings = this.config;

    var clean = data.map(function(d) {
        d.plotName = d[settings.comparison_col] + ' vs. ' + d[settings.reference_col];
        d[settings.p_col] = +d[settings.p_col];
        d[settings.ratio_col] = +d[settings.ratio_col];
        if (d[settings.ratio_col] > settings.ratioLimit) {
            d.origRatio = d[settings.ratio_col];
            d[settings.ratio_col] = +settings.ratioLimit;
            d.aboveLimit = true;
        }
        return d;
    });

    return clean;
}
