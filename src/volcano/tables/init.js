export default function init() {
    const settings = this.parent.config;

    this.selected = {
        data: [],
        multiplier: 1
    };

    this.selected.variables = d3.merge([
        [
            {
                value_col: settings.id_col.value_col,
                label: settings.id_col.label
            }
        ],
        settings.structure_cols.map(structure_col => {
            return {
                value_col: structure_col.value_col,
                label: structure_col.label
            };
        }),
        settings.detail_cols
            ? settings.detail_cols.map(detail_col => {
                  return {
                      value_col: detail_col.value_col,
                      label: detail_col.label
                  };
              })
            : []
    ]);

    this.details = {
        data: {
            details: [],
            stats: []
        }
    };

    this.details.variables = this.selected.variables;

    this.layout();
}
