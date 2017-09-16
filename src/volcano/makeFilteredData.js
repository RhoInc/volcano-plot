export function makeFilteredData() {
    var settings = this.config;
    var levelSet = new Set(this.data.levels.filter(f => f.selected).map(m => m.key));
    var filtered = this.data.clean.filter(d => levelSet.has(d[settings.color_col]));
    return filtered;
}
