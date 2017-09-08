(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
          ? define(factory)
          : (global.volcanoPlot = factory());
})(this, function() {
    'use strict';

    var defaultSettings = {
        height: 240,
        width: 300,
        margin: { top: 10, right: 10, bottom: 50, left: 80 },
        showYaxis: 'all',
        structure: [],
        colorVar: '',
        ratioLimit: 2.0,
        hexbin: {
            radius: { min: 3, max: 10 },
            countRange: { min: 3, max: 100 }
        }
    };

    function setDefaults(settings) {
        settings.height = settings.height ? settings.height : defaultSettings.height;
        settings.width = settings.width ? settings.width : defaultSettings.width;
        settings.margin = settings.margin ? settings.margin : defaultSettings.margin;
        settings.showYaxis = settings.showYaxis ? settings.showYaxis : defaultSettings.showYaxis;
        settings.structure = settings.structure ? settings.structure : [];
        settings.colorVar = settings.colorVar
            ? settings.colorVar
            : settings.structure.length >= 1 ? settings.structure[0] : defaultSettings.colorVar;
        settings.ratioLimit = settings.ratioLimit
            ? settings.ratioLimit
            : defaultSettings.ratioLimit;
        settings.hexbin = settings.hexbin ? settings.hexbin : {};
        settings.hexbin.radius = settings.hexbin.radius
            ? settings.hexbin.radius
            : defaultSettings.hexbin.radius;
        settings.hexbin.countRange = settings.hexbin.countRange
            ? settings.hexbin.countRange
            : defaultSettings.hexbin.countRange;

        return settings;
    }

    function prepData(data) {
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

    function init(data) {
        this.wrap = d3
            .select(settings.div)
            .append('div')
            .attr('class', 'ig-volcano');
        this.config = setDefaults(this.config);
        this.layout();

        this.data = {};
        this.data.raw = data;
        this.data.clean = prepData(data);

        this.makeScales();

        console.log(this);
    }

    function makeScales() {
        var settings = this.config;
        console.log(this);
        this.x = d3.scale
            .linear()
            .range([0, settings.width])
            .domain(
                d3.extent(this.data.clean, function(d) {
                    return d[settings.vars.ratio];
                })
            );

        this.y = d3.scale
            .log()
            .range([settings.height, 0])
            .domain([
                1,
                d3.min(this.data.clean, function(d) {
                    return d[settings.vars.pval];
                })
            ]);

        this.xAxis = d3.svg
            .axis()
            .scale(this.x)
            .orient('bottom');
        this.yAxis = d3.svg
            .axis()
            .scale(this.y)
            .orient('left')
            .ticks(5, d3.format('r'));

        this.radiusScale = d3.scale
            .sqrt()
            .range([settings.hexbin.radius.min, settings.hexbin.radius.max])
            .domain([settings.hexbin.countRange.min, settings.hexbin.countRange.max]);

        this.hexbin = d3
            .hexbin()
            .size([settings.width, settings.height])
            .radius(settings.hexbin.radius.max);
    }

    function layout() {}

    function createVolcano() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var config = arguments[1];

        var volcano = {
            element: element,
            config: config,
            init: init,
            makeScales: makeScales,
            layout: layout
        };

        volcano.events = {
            init: function init$$1() {},
            complete: function complete() {}
        };

        volcano.on = function(event, callback) {
            var possible_events = ['init', 'complete'];
            if (possible_events.indexOf(event) < 0) {
                return;
            }
            if (callback) {
                volcano.events[event] = callback;
            }
        };

        return volcano;
    }

    var index = {
        createVolcano: createVolcano
    };

    return index;
});
