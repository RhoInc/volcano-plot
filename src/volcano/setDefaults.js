import { defaultSettings as defaults } from './defaultSettings.js';

function objectify(col) {
    if (typeof col === 'string') {
        return { value_col: col, label: col };
    } else {
        return col;
    }
}

export function setDefaults(settings) {
    settings.id_col = objectify(settings.id_col ? settings.id_col : defaults.id_col);
    settings.p_col = settings.p_col ? settings.p_col : defaults.p_col;
    settings.ratio_col = settings.ratio_col ? settings.ratio_col : defaults.ratio_col;
    settings.height = settings.height ? settings.height : defaults.height;
    settings.width = settings.width ? settings.width : defaults.width;
    settings.margin = settings.margin ? settings.margin : defaults.margin;
    settings.showYaxis = settings.showYaxis ? settings.showYaxis : defaults.showYaxis;
    settings.structure_cols = settings.structure_cols ? settings.structure_cols : [];
    settings.structure_cols = settings.structure_cols.map(m => objectify(m));

    settings.detail_cols = settings.detail_cols ? settings.detail_cols : [];
    settings.detail_cols = settings.detail_cols.map(m => objectify(m));
    settings.color_col = settings.color_col
        ? settings.color_col
        : settings.structure_cols.length >= 1
          ? settings.structure_cols[0].value_col
          : defaults.color_col;

    settings.ratioLimit = settings.ratioLimit ? settings.ratioLimit : defaults.ratioLimit;
    settings.hexbin = settings.hexbin ? settings.hexbin : {};
    settings.hexbin.radius = settings.hexbin.radius
        ? settings.hexbin.radius
        : defaults.hexbin.radius;
    settings.hexbin.countRange = settings.hexbin.countRange
        ? settings.hexbin.countRange
        : defaults.hexbin.countRange;

    settings.filterTypes = settings.filterTypes ? settings.filterTypes : defaults.filterTypes;

    return settings;
}
