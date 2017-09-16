export function makeLevelData() {
    return d3
        .nest()
        .key(d => d[this.config.color_col])
        .rollup(d => d.length)
        .entries(this.data.clean)
        .sort(function(a, b) {
            return b.values > a.values ? 1 : b.values < a.values ? -1 : 0;
        })
        .map(function(d) {
            d.selected = true;
            return d;
        });
}
