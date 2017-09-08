export function prepData(data) {
    var clean = data.map(function(d) {
        d.plotName = d[settings.vars.comparison] + ' vs. ' + d[settings.vars.reference];
        d[settings.vars.pvalue] = +d[settings.vars.pvalue];
        d[settings.vars.ratio] = +d[settings.vars.ratio];
        if (d[settings.vars.ratio] > settings.ratioLimit) {
            d.origRatio = d[settings.vars.ratio];
            d[settings.vars.ratio] = +settings.ratioLimit;
            d.aboveLimit = true;
        }
        return d;
    });

    return clean;
}
