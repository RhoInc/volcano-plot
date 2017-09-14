export default function init() {
    const settings = this.parent.config;
    this.selected = {
        data: [],
        multiplier: 1
    };

    this.selected.variables = d3.merge([
        [settings.id_col],
        settings.structure_cols,
        settings.detail_cols
    ]);
    this.details = {
        data: {
            details: [],
            stats: []
        }
    };
    this.details.variables = d3.merge([
        [settings.id_col],
        settings.structure_cols,
        settings.detail_cols
    ]);
    console.log(this);
    this.layout();
}
