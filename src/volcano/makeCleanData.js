export function makeCleanData() {
    var data = this.data.raw;
    var settings = this.config;

    var clean = data
        .map(function(d) {
            d.plotName = d[settings.comparison_col] + ' vs. ' + d[settings.reference_col];
            d[settings.p_col] = d[settings.p_col] == '' ? NaN : +d[settings.p_col];
            d[settings.ratio_col] = d[settings.ratio_col] == '' ? NaN : +d[settings.ratio_col];
            if (d[settings.ratio_col] > settings.ratioLimit) {
                d.origRatio = d[settings.ratio_col];
                d[settings.ratio_col] = +settings.ratioLimit;
                d.aboveLimit = true;
            }
            return d;
        })
        .filter(function(d) {
            return d[settings.p_col] || d[settings.p_col] === 0;
        })
        .filter(function(d) {
            return d[settings.ratio_col] || d[settings.ratio_col] === 0;
        });

    if (clean.length < data.length) {
        var diff = data.length - clean.length;
        console.warn(
            diff +
                ' rows removed because of missing or invalid data for ratio and/or p-values. Numeric values are required. Did you have p<0.05 or something similar?'
        );
    }

    return clean;
}
