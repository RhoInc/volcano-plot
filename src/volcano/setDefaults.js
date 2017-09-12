import { defaultSettings as defaults } from './defaultSettings.js';

export function setDefaults(settings) {
    settings.p_col = settings.p_col ? settings.p_col : defaults.p_col;
    settings.ratio_col = settings.ratio_col ? settings.ratio_col : defaults.ratio_col;
    settings.height = settings.height ? settings.height : defaults.height;
    settings.width = settings.width ? settings.width : defaults.width;
    settings.margin = settings.margin ? settings.margin : defaults.margin;
    settings.showYaxis = settings.showYaxis ? settings.showYaxis : defaults.showYaxis;
    settings.structure = settings.structure ? settings.structure : [];
    settings.colorVar = settings.colorVar
        ? settings.colorVar
        : settings.structure.length >= 1 ? settings.structure[0] : defaults.colorVar;
    settings.ratioLimit = settings.ratioLimit ? settings.ratioLimit : defaults.ratioLimit;
    settings.hexbin = settings.hexbin ? settings.hexbin : {};
    settings.hexbin.radius = settings.hexbin.radius
        ? settings.hexbin.radius
        : defaults.hexbin.radius;
    settings.hexbin.countRange = settings.hexbin.countRange
        ? settings.hexbin.countRange
        : defaults.hexbin.countRange;

    return settings;
}
