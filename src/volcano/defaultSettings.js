export const defaultSettings = {
    id_col: null,
    p_col: null,
    ratio_col: null,
    reference_col: null,
    comparison_col: null,
    structure_cols: [],
    detail_cols: [],
    color_col: null,
    height: 240,
    width: 300,
    margin: { top: 10, right: 10, bottom: 50, left: 80 },
    showYaxis: 'all',
    ratioLimit: 2.0,
    hexbin: {
        radius: { min: 3, max: 10 },
        countRange: { min: 3, max: 100 }
    }
};
