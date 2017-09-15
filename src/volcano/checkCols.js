export function checkCols() {
    function objectify(col) {
        if (typeof col === 'string') {
            return { value_col: col, label: col };
        } else {
            return col;
        }
    }
    const colNames = Object.keys(this.data.raw[0]);
    const settings = this.config;
    const settingObjs = d3
        .merge([
            [
                settings.id_col,
                settings.p_col,
                settings.ratio_col,
                settings.reference_col,
                settings.comparison_col,
                settings.color_col
            ],
            settings.structure_cols,
            settings.detail_cols
        ])
        .map(m => objectify(m));
    settingObjs.forEach(function(col) {
        if (colNames.indexOf(col.value_col) == -1) {
            console.warn(
                "'" + col.value_col + "' column not found in the submitted data. Errors are likely."
            );
        }
    });
}
